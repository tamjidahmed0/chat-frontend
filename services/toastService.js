
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastService = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  promise: (promise, successMessage, errorMessage) => {
    return new Promise((resolve, reject) => {
      toast.promise(
        promise,
        {
          pending: 'Loading...',
          success: successMessage,
          error: errorMessage,
        }
      ).then(
        (result) => resolve(result),
        (error) => reject(error)
      );
    });
  },
};

export default toastService;
