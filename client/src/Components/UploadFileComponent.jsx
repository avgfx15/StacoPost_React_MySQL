import { IKContext, IKUpload } from 'imagekitio-react';
import { useRef } from 'react';
import { toast } from 'react-toastify';

const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_API_URL}/posts/upload-auth`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    console.error('Authenticator error:', error);
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

// ^ & Upload File Component
const UplaodFileComponent = ({ children, type, setProgress, setData }) => {
  const ref = useRef(null);

  const onError = (err) => {
    console.error('Upload error:', err);
    toast.error('Image upload failed!');
  };
  const onSuccess = (res) => {
    console.log('Upload success:', res);
    setData(res);
  };
  const onUploadProgress = (progress) => {
    console.log('Upload progress:', progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  // & Return Statement
  return (
    <IKContext
      publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className='hidden'
        ref={ref}
        accept={`${type}/*`}
      />
      <div className='cursor-pointer' onClick={() => ref.current.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default UplaodFileComponent;
