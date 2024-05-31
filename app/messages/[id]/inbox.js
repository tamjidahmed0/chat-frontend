"use client";
import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faImage, faFile, faXmark, faFileLines, faCircleCheck, faPhone } from "@fortawesome/free-solid-svg-icons";
import WaveSurfer from "wavesurfer.js";
import Image from "next/image";
import { useAppContext } from "@/context/context";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import blueBadge from "@/components/blueBadge";
import CallingModal from '@/components/callingModals'
import peer from "@/services/peer";
import getSocket from "@/lib/socketConnection";
import { useResponseContext } from "@/context/responsecontext";

import peers from 'peerjs'





const Inbox = (params) => {
  // const socket = getSocket(userId); 
  const { socket, dispatch } = useAppContext();
  const { states, dispatchs } = useResponseContext();
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setuserTyping] = useState(false);
  const [incommingTyping, setTyping] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [event, setEvent] = useState(null);
  const [scrollRef, setScrollRef] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState([]);
  const [selectAudio, setSelectAudio] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const messagesRef = useRef(null);
  const [onScreen, setOnScreen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRequested , setIsRequested] = useState()
  const [isCalling , setIsCalling] = useState(false)
  const [callingData , setIsCallingData] = useState({})
  const [incomingOffer , setIncomingOffer] = useState(null)
  const [myStream, setMyStream] = useState();
  const [lastActive , setLastActive] = useState('')

  const waveformRefs = useRef([]);

  const [peerId , setPeerId] = useState('')

  const peerInstance = useRef(null);

  const remoteAudioRef = useRef(null);
  const currentUserAudioRef = useRef(null);


// console.log(state, 'state')
  
  useEffect(() => {
    message.forEach((audio, index) => {
      if (audio.type === "audio") {
        const container = waveformRefs.current[index];
        waveformRefs.current[index].wavesurfer = WaveSurfer.create({
          container,
          waveColor: "#34374B",
          progressColor: "#F90",
          dragToSeek: true,
          width: "10vw",
          hideScrollbar: true,
          normalize: true,
          barGap: 1,
          height: 50,
          barHeight: 10,
          barRadius: 20,
          barWidth: 2,
        });

        waveformRefs.current[index].wavesurfer.load(`${process.env.NEXT_PUBLIC_API}/${audio.text}`);

        console.log(audio.text);

        // Listen for the finish event
        waveformRefs.current[index].wavesurfer.on("finish", () => {
          // Reset the playback to the beginning of the audio file
          waveformRefs.current[index].wavesurfer.seekTo(0);
        });

        return () => {
          waveformRefs.current[index].wavesurfer.destroy();
        };
      }
    });
  }, [message]);

  // Function to play the audio
  const playAudio = (index) => {
    // Pause currently playing audio, if any
    message.forEach((audio, i) => {
      if (i !== index && waveformRefs.current[i] && waveformRefs.current[i].wavesurfer) {
        waveformRefs.current[i].wavesurfer.pause();
      }
    });

    // Play or pause the clicked audio
    if (waveformRefs.current[index] && waveformRefs.current[index].wavesurfer) {
      waveformRefs.current[index].wavesurfer.playPause();
    }
  };

  useEffect(() => {
    dispatch({ type: "setreceiverId", payload: params.receiverId });
  }, [params.userID, params.receiverId]);

  //scroll
  useEffect(() => {
    // Set the scrollRef to the current value of messagesRef
    setScrollRef(messagesRef.current);
  }, []);

  //handle message change
  const handleMessageChange = (e) => {
    setInputValue(e.target.value);
  };

  //send button
  const handleSendClick = async () => {
    setuserTyping(false);

    // const reader = new FileReader()

    // reader.onload = () =>{

    //   const filedata = reader.result

    //   if(socket){

    //     socket.emit('uploadImage', { imageData: filedata })

    //   }

    // }

    // reader.readAsArrayBuffer(selectedFile)

    if (imagePreviews.length > 0) {
      // Emit the file data to the server
      imagePreviews.forEach((preview) => {
        const { file } = preview;
        const type = file.type;
        console.log(type, "type");

        const reader = new FileReader();

        reader.onload = () => {
          const fileData = reader.result;

          socket.emit("uploadImage", { imageData: fileData, type: type, senderId: params.userID, receiverId: params.receiverId, profile: params.senderDetails.profilePic });

          // Optionally, you can handle the response from the server here
          socket.on("uploadImageResponse", (response) => {
            console.log(response);
          });
        };

        reader.readAsArrayBuffer(file);
      });
    }

    setImagePreviews([]);

    //audio send
    // Assuming selectAudio is an array of audio files
    if (audioPreview.length > 0) {
      audioPreview.forEach((prev) => {
        const { file } = prev;
        const type = file.type;

        const reader = new FileReader();

        reader.onload = () => {
          const audioData = reader.result;
          console.log(audioData, "audio data");

          // Emit the audio data to the server
          socket.emit("uploadAudio", { audioData, type: type, senderId: params.userID, receiverId: params.receiverId, profile: params.senderDetails.profilePic, name: selectAudio[0].name });

          // Optionally, you can handle the response from the server here
          socket.on("uploadAudioResponse", (response) => {
            console.log(response);
          });
        };

        // Start reading the first audio file in selectAudio array
        reader.readAsArrayBuffer(file);
      });

      setAudioPreview([]);
    }

    // if(selectedFile !== null){
    //   const reader = new FileReader();

    //   reader.onload = () => {
    //     const fileData = reader.result;

    //     socket.emit('uploadImage', { imageData: fileData,type:selectedFile.type,  senderId : params.userID, receiverId : params.receiverId, profile:params.senderDetails.profilePic });

    //     // Optionally, you can handle the response from the server here
    //     socket.on('uploadImageResponse', (response) => {
    //       console.log(response);
    //     });
    //   };

    //   reader.readAsArrayBuffer(selectedFile);

    // }

    if (inputValue.length !== 0 || inputValue.trim().length !== 0) {
      //if socket available
      if (socket) {
        // Emit the message using the existing socket
        const date = new Date();
        const timeString = date.toLocaleTimeString("en-US", {
          hour12: true,
          hour: "numeric",
          minute: "numeric",
        });

        //send socket message to server
        socket.emit("sendMessage", {
          name: params.senderDetails.name,
          profile: params.senderDetails.profilePic,
          senderId: params.userID,
          receiverId: params.receiverId,
          text: inputValue,
          socketId: socket.id,
          types: "text",
          Dates: timeString,
        });
      }
    }

    setInputValue("");
  };

  //receive incomming message
  useEffect(() => {
    setMessage(params.messages);

    if (socket) {
      const handleReceiverMessage = (data) => {
        console.log(data, "receivermessage");
        if (params.receiverId === data.iSend) {
          console.log("Received message from server:", data);
          setMessage((msgs) => [...msgs, data]);

          if (scrollRef) {
            // Scroll to the bottom when new messages arrive
            scrollRef.scrollTop = scrollRef.scrollHeight;
          }
        }
      };

      // receive incomming msg
      socket.on("receivermessage", handleReceiverMessage);

      // Cleanup function to remove the event listener when the component unmounts or the dependency changes
      return () => {
        if (socket) {
          socket.off("receivermessage");
        }
      };
    }
  }, [socket, params.receiverId]);

  useEffect(() => {
    if (socket) {
      socket.on("imageReceive", (data) => {
        console.log(data);
        setMessage((msgs) => [...msgs, data]);
      });

      socket.on("audioReceive", (data) => {
        setMessage((msgs) => [...msgs, data]);
      });
    }

    return () => {
      if (socket) {
        socket.off("imageReceive");
        socket.off("audioReceive");
      }
    };
  }, [socket, params.receiverId]);

  //outgoing text
  useEffect(() => {
    if (socket) {
      socket.on("sendermsg", (sendermsg) => {
        // console.log(sendermsg, 'come from sender')
        // dispatch(setConversation(sendermsg));
        setuserTyping(false);

        setMessage((msgs) => [...msgs, sendermsg]);
      });

      socket.on("outgoingMedia", (data) => {
        setMessage((msgs) => [...msgs, data]);
      });

      socket.on("outgoingAudioMedia", (data) => {
        setMessage((msgs) => [...msgs, data]);
      });
    }

    return () => {
      if (socket) {
        socket.off("sendermsg");
        socket.off("outgoingMedia");
        socket.off("outgoingAudioMedia");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      // socket.emit('outgoingMedia' , {
      //   iSend: senderId,
      //   text: text,
      //   Date: Dates,
      //   receiverId: receiverId,
      //   messageStatus: 'sent'
      // })
    }
  }, [socket]);

  // key press

  const handleEnterKeyPress = (e) => {
    const updatedValue = inputValue.slice(0, -1);
    const updatedReverseLength = updatedValue.split().reverse().join().length;

    // if (updatedReverseLength > 0) {

    //  setuserTyping(true)

    //   // setTimeout(() => {
    //   //   setuserTyping(true);
    //   // }, 0);
    // }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSendClick();
      setuserTyping(false);
    }

    if (e.key === "Backspace") {
      if (updatedReverseLength === 0) {
        setuserTyping(false);
        console.log("back");

        // setTimeout(() => {
        //   setuserTyping(true);
        // }, 0);
      } else if (updatedReverseLength > 0) {
        // setuserTyping(true);
      }
    }
  };

  //typing event
  useEffect(() => {
    if (inputValue.length === 0 || inputValue.trim().length === 0) {
      setuserTyping(false);
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
      setuserTyping(true);
    }

    console.log(typing);

    if (inputValue.length > 0) {
      setuserTyping(true);
      if (socket) {
        socket.emit("typing", {
          socketId: socket.id,
          receiverId: params.receiverId,
          senderId: params.userID,
          msg: typing,
          profile: params.senderDetails.profilePic,
        });
      }
    }
  }, [inputValue]);

  // console.log(typing)
  //image upload button enable disabled
  useEffect(() => {
    if (imagePreviews.length === 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }

    // if(selectAudio === null){
    //   setIsButtonDisabled(false)
    // }else{
    //   setIsButtonDisabled(true)
    // }
  }, [imagePreviews]);

  useEffect(() => {
    if (selectAudio.length === 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectAudio]);

  //receive typing event
  if (socket) {
    socket.on("typingmsg", (data) => {
      if (params.receiverId === data.senderId) {
        setTyping(data.msg);

        console.log(data.msg);
        // console.log(data, 'linne 192')

        // const updatedValue = inputValue.slice(0, -1);
        // const updatedReverseLength = updatedValue.split("").reverse().join("").length;

        // console.log(updatedReverseLength);

        // if (updatedReverseLength === 0) {
        //   setTimeout(() => {
        //     setuserTyping(true);
        //   }, 0);
        // }
      }
    });
  }

  // console.log(event);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    const newPreviews = [];

    const newAudioPreview = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        newPreviews.push({ id: Date.now() + i, url: imageUrl, file });
      } else if (file.type.startsWith("audio/")) {
        const audioUrl = URL.createObjectURL(file);
        newAudioPreview.push({ id: Date.now() + i, url: audioUrl, file });

        setSelectAudio(files);

        console.log("audio");
      } else if (file.type.startsWith("video/")) {
        console.log("video");
      }
    }

    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    setAudioPreview((prevPreviews) => [...prevPreviews, ...newAudioPreview]);

    setSelectedFile(files);
  };

  // const handleFileChange = (event) => {

  //   const files = event.target.files;

  //   // for (let i = 0; i < files.length; i++) {
  //   //   const file = files[i];
  //   //   if (file.type.startsWith('image/')) {
  //   //     // Handle image file
  //   //     handleImageFile(file);
  //   //   } else if (file.type.startsWith('audio/')) {
  //   //     // Handle audio file
  //   //     handleAudioFile(file);
  //   //   } else if (file.type.startsWith('video/')) {
  //   //     // Handle video file
  //   //     handleVideoFile(file);
  //   //   } else {
  //   //     // Handle other file types
  //   //     handleOtherFile(file);
  //   //   }
  //   // }

  // };

  const handleImageFile = (imageFile) => {
    // Handle image file

    const newPreviews = [];

    const imageUrl = URL.createObjectURL(imageFile);
    newPreviews.push({ id: Date.now(), url: imageUrl, imageFile });

    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

    // setSelectedFile((prevSelectedFiles) => [...prevSelectedFiles, imageFile]);

    setSelectedFile(newPreviews);

    console.log(newPreviews, "imagefile");
  };

  const handleAudioFile = (audioFile) => {
    // Handle audio file
  };

  const handleVideoFile = (videoFile) => {
    // Handle video file
  };

  const handleOtherFile = (file) => {
    // Handle other file types
  };

  const handleRemovePreview = (id) => {
    setImagePreviews((prevPreviews) => prevPreviews.filter((preview) => preview.id !== id));
  };
  const handleAudioRemovePreview = (id) => {
    setAudioPreview((prevPreviews) => prevPreviews.filter((preview) => preview.id !== id));
  };

  // useEffect(()=>{

  //   if(socket){
  // socket.emit('onScreen', {
  // senderId:params.userID,
  // receiverId:params.receiverId,
  // socketId:socket.id
  // })

  //   socket.on('onScreenReceive', (data)=>{
  //    setOnScreen(true)
  //   })

  //   }

  // return () =>{
  //   if(socket){
  //     socket.off('onScreen')
  //   }
  //   // setOnScreen(false)
  // }

  // },[socket, params.messages])

  const handleEmojiSelect = async (e) => {
    const split = e.unified.split("_");
    const emojiArray = [];

    split.forEach((el) => emojiArray.push("0x" + el));

    let emoji = String.fromCodePoint(...emojiArray);
    setInputValue(inputValue + emoji);

    console.log(e.native);
  };




  useEffect(()=>{


    if(socket){
      socket.emit('activeStatus', {
        userId : params.receiverId
      })





   socket.on('lastactive', (data)=>{
    


    if(data.active === 'online'){
     setLastActive(data.active)
    }else{

// Function to calculate time elapsed
function getTimeElapsed(timestamp) {
  const currentTime = Date.now();
  const providedTime = new Date(timestamp).getTime();
  const difference = currentTime - providedTime;
  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `Active ${days} day${days > 1 ? 's ago' : ' ago'}`;
  } else if (hours > 0) {
    return `Active ${hours} hour${hours > 1 ? 's ago' : ' ago'}`;
  } else {
    return `Active ${minutes} minute${minutes > 1 ? 's ago' : ' ago'}`;
  }
}



setInterval(()=>{
  const activeStatus =  getTimeElapsed(data.active)

  if(activeStatus.startsWith('0')){
    setLastActive('online')
  }else{
setLastActive(activeStatus)
  }

},1000)


 








    }











      })




   





    }



  },[socket])





 useEffect(()=>{

  if(socket){
    socket.on('userOnline', (data)=>{
      // setLastActive(data.online)
      console.log(data)
    })
  }




 }, [socket])






//  const handleCall = useCallback(async () => {
//   console.log('called')
//   const width = 800;
//   const height = 600;
//   const left = (window.screen.width / 2) - (width / 2);
//   const top = (window.screen.height / 2) - (height / 2);
//   const features = `width=${width},height=${height},left=${left},top=${top}`;

//   const newWindow = window.open('/groupcall', 'calling status', features);

// // Check if the new window is created successfully
// // if (newWindow) {
// //   newWindow.document.write('<h1>Calling Status</h1>');
// //   newWindow.document.write('<p id="status">Connecting...</p>');
// // } else {
// //   alert('Failed to open new window');
// // }

// const offer = await peer.getOffer() 

// if( socket){
//   socket.emit('user:incomming' , {
//     requestForCalling:params.receiverId,
//     callerSocketId:socket.id,
//     peerOffer: offer
//   })
// }
// }, [ socket]);









useEffect(()=>{

  const peerc = new peers()

 peerc.on('open', (id)=>{
   setPeerId(id)
   
 })



 // Handle incoming calls
 peerc.on('call', (call) => {

  console.log('incomming call')

  navigator.mediaDevices.getUserMedia({ audio: true }) // Request access to the user's audio
    .then((mediaStream) => {
      if (currentUserAudioRef.current) {
        currentUserAudioRef.current.srcObject = mediaStream; // Set the local audio stream
        currentUserAudioRef.current.play(); // Play the local audio stream
      }

      // Answer the incoming call with the local audio stream
      call.answer(mediaStream);

      // When receiving a remote stream, set it to the remote audio element
      call.on('stream', (remoteStream) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream; // Set the remote audio stream
          remoteAudioRef.current.play(); // Play the remote audio stream
        }
      });
    })
    .catch((err) => {
      console.error('Failed to get local stream', err); // Handle errors
    });
});







 peerInstance.current = peerc;


  // Clean up on component unmount
  return () => {
    peerc.destroy(); // Destroy the PeerJS instance
  
  };



},[socket])








const handleCall = async () =>{

try {
  
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true});


  // Set your local audio stream
  if (currentUserAudioRef.current) {
    currentUserAudioRef.current.srcObject = stream;
    currentUserAudioRef.current.play();
  }



console.log(stream, 'stream')


  console.log('called')
 

const offer = await peer.getOffer() 

// await peer.setLocalDescription(offer);


if( socket){
  socket.emit('user:incomming' , {
    id:params.userID,
    requestForCalling:params.receiverId,
    callerSocketId:socket.id,
    peerOffer: peerId
  })



}
} catch (error) {
  console.log(error)
}





 }

 
 useEffect(()=>{

  

  if(socket){
    socket.on('incommingoffer', async(data)=>{


  // Answer the call
  const call = peerInstance.current.call(data.peerOffer, await navigator.mediaDevices.getUserMedia({ audio: true }));

  // When receiving a remote stream, set it to the remote audio element
  call.on('stream', (remoteStream) => {
    console.log('remote stream receive')
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream; // Set the remote audio stream
      remoteAudioRef.current.play(); // Play the remote audio stream
    }
  });







console.log(data.peerOffer)


socket.emit('call:accepted', {
  userId: data.userId,
  socket:socket.id,
 peerAnswer: ''
})


setIncomingOffer(data.peerOffer)

      setIsCalling(true)
      setIsCallingData(data)
      console.log(data)
    })
  }




 }, [socket])





 useEffect(()=>{

  if(socket){
    socket.on('call:accepted', async(data)=>{
      console.log(data, 'callaccepted')



    })
  }


 },[socket])







  return (
    <div className="mx-2 flex flex-col h-full relative">

<audio ref={remoteAudioRef} controls /> remote


{/* <audio ref={currentUserAudioRef} controls /> current */}


   {isCalling && <CallingModal name={callingData.name} image={callingData.profile} offer={incomingOffer} id={callingData.id} />}
   
        
      <div className="flex items-center h-28 bg-lightdark pl-4">
   
     
      


        <Image src={`${process.env.NEXT_PUBLIC_API}/${params.profile?.profilePic}`} width={500} height={500} objectFit="cover" className="rounded-full w-[5rem] h-[5rem] object-cover" />
     
        <div className="ml-5">
          <div className = ' flex items-center'>
          <h1 className="font-bold text-xl text-white">{params.profile?.name}</h1>

          
          {/* <button data-tooltip-target="tooltip-right" data-tooltip-placement="right" type="button" class="ms-3 mb-2 md:mb-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Tooltip right</button>

<div id="tooltip-right" role="tooltip" class="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
    Tooltip on right
    <div class="tooltip-arrow" data-popper-arrow></div>
</div> */}



          {params.profile?.verified && <FontAwesomeIcon icon={faCircleCheck} size="x" color="#1F71F7" className=" ml-2 cursor-pointer" />}
     
        
          </div>
         
          <span className="text-green-600 font-semibold">{incommingTyping ? "Typing..." : lastActive }</span>
        </div>


        <FontAwesomeIcon icon={faPhone} size="xl" color="#fff" className=" ml-2 cursor-pointer absolute right-20" onClick={handleCall} />
       
      </div>

     

      <div className="flex-grow bg-lightdark pl-4 mt-2 overflow-y-auto  h-0 " ref={messagesRef}>

      <div className="flex items-center h-28 bg-lightdark pl-4 flex-col mt-4 mb-16">
        <Image src={`${process.env.NEXT_PUBLIC_API}/${params.profile?.profilePic}`} width={500} height={500} objectFit="cover" className="rounded-full w-[8rem] h-[8rem] object-cover" />
        <div className="ml-5">
          <div className = ' flex items-center'>
          <h1 className="font-bold text-[1.5rem] text-white">{params.profile?.name}</h1>
          {params.profile?.verified && <FontAwesomeIcon icon={faCircleCheck} size="x" color="#1F71F7" className=" ml-2 cursor-pointer" />}
        
          </div>
         
        </div>
      </div>


        {message.map((data, index) => (
          <div key={index} className={`flex mb-1 cursor-pointer mt-16 ${data.whoSend ? "" : "justify-end"}`}>
            <div className="w-24 h-9 rounded-full flex items-center justify-center mr-2">
              <Image src={`${process.env.NEXT_PUBLIC_API}/${data.profile}`} width={50} height={50} objectFit="cover" className={`${data.whoSend ? "" : "hidden"} rounded-full w-[4rem] h-[4rem] object-cover`} />
            </div>
            {data.type === "image" ? (
              <Image src={`${process.env.NEXT_PUBLIC_API}/${data.text}`} width={400} height={400} className="rounded-md border" />
            ) : data.type === "audio" ? (
              <div key={index} ref={(ref) => (waveformRefs.current[index] = ref)}>
                <button onClick={() => playAudio(index)}>Play</button>
              </div>
            ) : (
         

<div className="flex max-w-96 bg-white rounded-lg p-3 gap-3 items-start">
                <p className="text-gray-700">{data.text}</p>
              
               
              </div>



            
            
              
            )}
          </div>
        ))}
      </div>

      {/* <SendMsg params ={params.id} userID ={user.value } /> */}

      {/* bg-[#1A2238] */}

      {params.request && (



<div className=" border-t border-gray-300 p-4  bottom-0 w-full bg-[#1A2238] relative">
{isPickerOpen && (
  <div className=" bottom-36 absolute">
    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
  </div>
)}
<div className="mr-4  flex items-center absolute top-1/2 z-10 ">
  <FontAwesomeIcon icon={faFaceSmile} size="xl" color={isPickerOpen ? "#0084FF" : "#fff"} className=" mr-4 cursor-pointer" onClick={() => setIsPickerOpen(!isPickerOpen)} />

  <label className="relative cursor-pointer">
    <FontAwesomeIcon icon={faFile} size="xl" color="#fff" className="mr-2" />
    <input type="file" accept="image/*, audio/*, video/*" onChange={handleFileChange} className="hidden" multiple />
  </label>
</div>


<div className="flex items-center relative justify-end">
  <div className=" w-[80%]  bg-[#2F374B] rounded-full py-3  ">
    <div className=" flex ml-10 overflow-x-auto">

      {imagePreviews.map((preview) => (
        <div key={preview.id} className="  mt-6 relative">
          <div className="w-24 h-24 rounded-md flex items-center justify-center ">
            <h1>{console.log(preview)}</h1>

            <Image src={preview.url} width={50} height={50} objectFit="cover" className={` rounded-md w-[4rem] h-[4rem] object-cover`} />
          </div>
       

          <FontAwesomeIcon icon={faXmark} size="xl" color="#fff" onClick={() => handleRemovePreview(preview.id)} className=" top-1 absolute right-2" />
     
        </div>
      ))}
      {audioPreview.map((preview, i) => (
        <div key={preview.id} className="  mt-6 relative">
          <div className=" rounded-md flex items-center justify-center bg-[#242526] p-3 mr-4">
  
            <FontAwesomeIcon icon={faFileLines} size="xl" color="#fff" className=" bg-[#18191A] p-3 rounded-full" />

            <h1 className=" text-white font-bold ml-4 ">{preview.file.name}</h1>
            <FontAwesomeIcon icon={faXmark} size="xl" color="#fff" onClick={() => handleAudioRemovePreview(preview.id)} className=" top-1 absolute right-4" />


          </div>
      
        </div>
      ))}
    </div>
    <input type="text" onKeyDown={handleEnterKeyPress} onChange={handleMessageChange} value={inputValue} placeholder="Type a message..." className=" w-[100%] ml-10 p-2   focus:outline-none focus:border-blue-500 bg-transparent text-white" />
  </div>
  <button onClick={handleSendClick} className={`bg-indigo-500 text-white px-4 py-2 rounded-md ml-2 ${!isButtonDisabled && "opacity-50 cursor-not-allowed"} `} disabled={!isButtonDisabled}>
    Send
  </button>
</div>
</div>

      )}



    </div>
  );
};

export default Inbox;
