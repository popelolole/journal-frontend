import React, { useState } from 'react';
import Header from '../components/Header.js';
import DrawingComponent from '../components/DrawingComponent.js';
import { useAuth } from 'react-oidc-context';



const ImagePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const auth = useAuth();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if(searchResult) setSearchResult(null);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage({name: file.name, dataUrl: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('name', selectedFile.name);
      formData.append('uploaded_by_id', auth.user?.profile.sub);

      const token = auth.user?.access_token;

      try {
        const response = await fetch('https://raven-image-svc.app.cloud.cbh.kth.se/images', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        console.log('Image uploaded successfully', response);
        setUploadedImage(null);
        setSelectedFile(null);

      } catch (error) {
        console.error('Error uploading image', error);
      }
    }
  };

  const handleSearch = async () => {
    try {
      const token = auth.user?.access_token;

      const response = await fetch(`https://raven-image-svc.app.cloud.cbh.kth.se/images/${searchId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      const binaryData = new Uint8Array(result.data.data);
      const resultDataUrl = `data:image/png;base64,${btoa(String.fromCharCode(...binaryData))}`;

      if(uploadedImage) setUploadedImage(null);

      console.log(resultDataUrl);

      setSearchResult({
        result: result,
        dataUrl: resultDataUrl,
      });
      setSearchId('');

    } catch (error) {
      console.error('Error searching for image', error);
    }
  };

  const handleSaveImage = async (dataUrl) => {
    const blob = await dataURLtoBlob(dataUrl);
    const formData = new FormData();
    formData.append('image', blob);

    const token = auth.user?.access_token;

    try {
      const response = await fetch(`https://raven-image-svc.app.cloud.cbh.kth.se/images/update/${searchResult.result.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Image uploaded successfully', response);
      setSearchResult(null);

    } catch (error) {
      console.error('Error uploading image', error);
    }
  }

  const dataURLtoBlob = async (dataURL) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
  
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
  
    return new Blob([uInt8Array], { type: contentType });
  };

  return (
    <div>
      <Header />

      <input type="file" accept="image/*,.jpeg,.jpg,.png,.gif,.webp" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <hr />

      <div>
        <label>Search Image by ID:</label>
        <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>

      {uploadedImage && (
        <div>
          <h2>Upload Image "{uploadedImage.name}"</h2>
          <img src={uploadedImage.dataUrl} alt={uploadedImage.name} style={{ maxWidth: '50%' }} />
        </div>
      )}

      {searchResult && (
        <div>
          <h2>Search Result: "{searchResult.result.name}"</h2>
          <DrawingComponent imageUrl={searchResult.dataUrl} onSave={handleSaveImage} />
        </div>
      )}
    </div>
  );
};

export default ImagePage;
