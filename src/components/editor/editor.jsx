// components/TinyEditor.tsx
import { Editor } from '@tinymce/tinymce-react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import FormHelperText from '@mui/material/FormHelperText';
import { varAlpha } from '../../theme/styles';
import { useTheme } from '@mui/material/styles';

export const TinyEditor = forwardRef(
  (
    {
      sx,
      error,
      onChange,
      slotProps,
      helperText,
      editable = true,
      resetValue,
      fullItem = false,
      value = '',
      placeholder = 'متنی شگفت‌انگیز بنویسید...',
      ...other
    },
    ref
  ) => {
    const [fullScreen, setFullScreen] = useState(false);
    const editorRef = useRef(null);
    const theme = useTheme();

    useEffect(() => {
      if (!value && resetValue) {
        editorRef.current?.setContent('');
      }
    }, [value, resetValue]);

    useEffect(() => {
      document.body.style.overflow = fullScreen ? 'hidden' : '';
    }, [fullScreen]);

    return (
      <Portal disablePortal={!fullScreen}>
        {fullScreen && <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal - 1 }} />}
        <Stack sx={{ ...(!editable && { cursor: 'not-allowed' }), ...slotProps?.wrap }}>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINY}
            value={value}
            onInit={(evt, editor) => (editorRef.current = editor)}
            onEditorChange={(content) => onChange?.(content)}
            init={{
              height: fullScreen ? '100vh' : 500,
              menubar: true,
              directionality: 'rtl',
              language: 'fa',
              readonly: !editable,
              placeholder,
              selector: 'textarea',
              plugins: [
                'media',
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'table',
                'help',
                'wordcount',
              ],
              toolbar: [
                'undo redo | blocks | fontfamily | fontsize | bold italic underline | forecolor backcolor', // Format dropdown
                'alignleft aligncenter alignright | bullist numlist outdent indent | link image table code | fullscreen media', // Other toolbar items
              ],
              block_formats: 'Paragraph=p; سرفصل 1=h1; سرفصل 2=h2; سرفصل 3=h3; سرفصل 4=h4; سرفصل 5=h5; سرفصل 6=h6;', // Replace "Heading" with "سرفصل"
              font_family_formats: `
                IRANSans=IRANSans, Vazirmatn Variable, sans-serif;
                Arial=arial,helvetica,sans-serif;
                Courier New=courier new,courier,monospace;
                AkrutiKndPadmini=Akpdmi-n;
              `,
              font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
              images_upload_handler: async (blobInfo, success, failure) => {
                try {
                  const formData = new FormData();
                  formData.append('file', blobInfo.blob(), blobInfo.filename());

                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });

                  const data = await res.json();
                  success(data.location); // URL
                } catch (err) {
                  failure('آپلود تصویر با مشکل مواجه شد');
                }
              },
              file_picker_types: 'image',
              image_title: true,
              automatic_uploads: true,
              body_class: 'custom-editor-body',
              content_style: `
                @font-face {
                  font-family: 'IRANSans';
                  src: url('/fonts/IRANSansWeb.woff') format('woff');
                  font-weight: normal;
                  font-style: normal;
                  font-display: swap;
                }

                body {
                  font-family: 'IRANSans', sans-serif;
                  font-size: 14px;
                  direction: rtl;
                  text-align: right;
                  background-color: ${theme.vars.palette.grey['500Channel']};
                  color: ${theme.vars.palette.text.primary};
                }

                ::placeholder {
                  color: ${theme.vars.palette.text.disabled};
                  font-style: italic;
                }

                p {
                  margin-bottom: 1rem;
                  line-height: 1.8;
                }

                h1 { font-size: 32px; font-weight: 700; margin: 1em 0; }
                h2 { font-size: 28px; font-weight: 700; margin: 1em 0; }
                h3 { font-size: 24px; font-weight: 700; margin: 1em 0; }
                h4 { font-size: 20px; font-weight: 600; margin: 1em 0; }
                h5 { font-size: 16px; font-weight: 600; margin: 1em 0; }
                h6 { font-size: 14px; font-weight: 600; margin: 1em 0; }
              `,
              setup: (editor) => {
                editor.ui.registry.addButton('togglefullscreen', {
                  text: fullScreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه',
                  onAction: () => setFullScreen((prev) => !prev),
                });
              },
            }}
            {...other}
          />
          {helperText && (
            <FormHelperText error={!!error} sx={{ px: 2 }}>
              {helperText}
            </FormHelperText>
          )}
        </Stack>
      </Portal>
    );
  }
);
