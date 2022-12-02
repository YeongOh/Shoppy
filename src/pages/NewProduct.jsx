import React, { useState } from 'react';
import { uploadImage } from '../api/uploader';
import Button from '../components/ui/Button';
import useProducts from '../hooks/useProducts';

export default function NewProduct() {
  const [file, setFile] = useState();
  const [product, setProduct] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState();
  const { addProduct } = useProducts();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFile(files && files[0]);
      return;
    }
    setProduct((product) => ({ ...product, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    uploadImage(file) //
      .then((url) => {
        addProduct.mutate(
          { product, url },
          {
            onSuccess: () => {
              setSuccess('Product registered successfully.');
              setTimeout(() => {
                setSuccess(null);
              }, 4000);
            },
          }
        );
      })
      .finally(() => setIsUploading(false));
  };

  return (
    <section className='w-full text-center'>
      <h2 className='text-2xl font-bold my-4'>New Product Registration</h2>
      {success && <p className='my-2'> Registered {success} </p>}
      {file && (
        <img
          className='w-96 mx-auto mb-2'
          src={URL.createObjectURL(file)}
          alt='local file'
        />
      )}
      <form className='flex flex-col px-12' onSubmit={onSubmit}>
        <img src={file} alt='preview' />
        <input
          type='file'
          onChange={handleChange}
          accept='image/*'
          name='file'
          required
        />
        <input
          name='title'
          value={product.title ?? ''}
          placeholder='product name'
          type='text'
          required
          onChange={handleChange}
        />
        <input
          name='price'
          value={product.price ?? ''}
          placeholder='price'
          type='number'
          required
          onChange={handleChange}
        />
        <input
          name='category'
          value={product.category ?? ''}
          placeholder='category'
          type='text'
          required
          onChange={handleChange}
        />
        <input
          name='description'
          value={product.description ?? ''}
          placeholder='description'
          type='text'
          required
          onChange={handleChange}
        />
        <input
          name='options'
          value={product.options ?? ''}
          placeholder='options - separate them with commas (,)'
          type='text'
          required
          onChange={handleChange}
        />
        <Button
          text={isUploading ? 'Uploading...' : 'Register a product'}
          disabled={isUploading}
        />
      </form>
    </section>
  );
}
