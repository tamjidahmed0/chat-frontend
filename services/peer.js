class PeerService {
  constructor() {
    if (typeof window !== 'undefined' && !this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }
  
    async getAnswer(offer) {
      if (this.peer) {
        await this.peer.setRemoteDescription(offer);
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(ans));
        return ans;
      }
    }
  
    // async setLocalDescription(ans) {
    //   // if (this.peer) {
    //   //   await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    //   // }


    //   if (this.peer) {
    //     try {
    //       if (this.peer.signalingState === 'have-local-offer') {
    //         await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    //         // await this.peer.setLocalDescription(ans)
    //       } else {
    //         console.warn('Peer connection is in wrong state:', this.peer.signalingState);
    //       }
    //     } catch (error) {
    //       console.error('Error setting remote answer:', error);
    //     }
    //   }


    // }




    async setLocalDescription(ans) {
      if (this.peer) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
      }
    }

  
    async getOffer() {
      if (this.peer) {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
      }
    }
  }
  
  export default new PeerService();