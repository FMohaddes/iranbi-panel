import { useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

export const useImageUpload = ({ watch, setValue, fieldName = 'ProductImage' }) => {
  const handleRemoveFile = useCallback(async (image) => {
    try {
      const currentImages = watch(fieldName) || [];
      const normalizedImageURL = image.replace(process.env.NEXT_PUBLIC_ASSET_URL, '');

      if (typeof image === 'string') {
        try {
          await axios.delete(endpoints.upload.delete, {
            data: { filePath: normalizedImageURL },
          });
          toast.success('تصویر حذف شد.');
        } catch (error) {
          console.error('Delete error:', error);
          toast.error('خطا در حذف تصویر!');
          return;
        }
      }

      const updatedImages = currentImages.filter((file) => file !== normalizedImageURL);
      setValue(fieldName, updatedImages, { shouldValidate: true });
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('خطا در حذف تصویر!');
    }
  }, [watch, setValue, fieldName]);

  const handleRemoveAllFiles = useCallback(async () => {
    try {
      const images = watch(fieldName) || [];

      await Promise.all(
        images.map(async (image) => {
          if (typeof image === 'string') {
            const normalizedImageURL = image.replace(process.env.NEXT_PUBLIC_ASSET_URL, '');
            try {
              await axios.delete(endpoints.upload.delete, {
                data: { filePath: normalizedImageURL },
              });
            } catch (error) {
              console.error('Error deleting image:', image, error);
            }
          }
        })
      );

      setValue(fieldName, [], { shouldValidate: true });
      toast.success('تمامی تصاویر حذف شدند.');
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('خطا در حذف تصاویر!');
    }
  }, [watch, setValue, fieldName]);

  const handleUpload = useCallback(
    async (files) => {

      if (!files || files.length === 0) {
        console.error('No files to upload.');
        return;
      }

      const newFiles = files.filter((file) => file instanceof File);
      if (newFiles.length === 0) {
        console.warn('No new files to upload.');
        return;
      }

      const grouped = {
        image: [],
        video: [],
        file: [],
      };

      // Classify files
      newFiles.forEach((file) => {
        const mime = file.type;

        if (mime.startsWith('image/')) grouped.image.push(file);
        else if (mime.startsWith('video/')) grouped.video.push(file);
        else grouped.file.push(file);
      });

      const uploadByType = async (type, fileList) => {
        if (fileList.length === 0) return [];

        const formData = new FormData();
        fileList.forEach((file) => formData.append('files', file));

        const endpoint =
          type === 'image'
            ? endpoints.upload.image
            : type === 'video'
              ? endpoints.upload.video
              : endpoints.upload.file;

        try {
          const response = await axios.post(endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (response.status === 200) {
            return (response.data || []).map((file) => file.url);
          } 
            toast.error(`خطا در آپلود ${type}`);
            return [];
          
        } catch (error) {
          console.error(`Upload ${type} error:`, error);
          toast.error(`خطا در آپلود ${type}`);
          return [];
        }
      };

      try {
        const [imagePaths, videoPaths, filePaths] = await Promise.all([
          uploadByType('image', grouped.image),
          uploadByType('video', grouped.video),
          uploadByType('file', grouped.file),
        ]);

        const uploadedPaths = [...imagePaths, ...videoPaths, ...filePaths];
        const existingValue = watch(fieldName);

        if (Array.isArray(existingValue)) {
          // For array uploads (e.g., gallery)
          const onlyStrings = existingValue.filter((item) => typeof item === 'string');
          setValue(fieldName, [...onlyStrings, ...uploadedPaths], {
            shouldValidate: true,
          });
        } else {
          // For single file uploads (e.g., cover or ogImage)
          setValue(fieldName, uploadedPaths[0] || null, {
            shouldValidate: true,
          });
        }


        toast.success('فایل‌ها با موفقیت آپلود شدند.');
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('خطا در آپلود فایل‌ها!');
      }
    },
    [watch, setValue, fieldName]
  );

  return {
    handleRemoveFile,
    handleRemoveAllFiles,
    handleUpload,
  };
};
