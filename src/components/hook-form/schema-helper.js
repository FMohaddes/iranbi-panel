import dayjs from 'dayjs';
import { z as zod } from 'zod';

// ----------------------------------------------------------------------

export const schemaHelper = {
  /**
   * Phone number
   * defaultValue === null
   */
  phoneNumber: (props) =>
    zod
      .string()
      .min(1, {
        message: props?.message?.required_error ?? 'تلفن همراه الزامی است',
      })
      .refine((data) => props?.isValidPhoneNumber?.(data), {
        message: props?.message?.invalid_type_error ?? 'تلفن همراه نامعتبر است',
      }),
  /**
   * date
   * defaultValue === null
   */
  date: (props) =>
    zod.coerce
      .date()
      .nullable()
      .transform((dateString, ctx) => {
        const date = dayjs(dateString).format();

        const stringToDate = zod.string().pipe(zod.coerce.date());

        if (!dateString) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.required_error ?? 'تاریخ الزامی است',
          });
          return null;
        }

        if (!stringToDate.safeParse(date).success) {
          ctx.addIssue({
            code: zod.ZodIssueCode.invalid_date,
            message: props?.message?.invalid_type_error ?? 'تاریخ نامعتبر!!',
          });
        }

        return date;
      })
      .pipe(zod.union([zod.number(), zod.string(), zod.date(), zod.null()])),
  /**
   * editor
   * defaultValue === '' | <p></p>
   */
  editor: (props) =>
    zod.string().min(8, {
      message: props?.message?.required_error ?? 'ویرایشگر الزامی است!',
    }),
  /**
   * object
   * defaultValue === null
   */
  objectOrNull: (props) =>
    zod
      .custom()
      .refine((data) => data !== null, {
        message: props?.message?.required_error ?? 'فیلد الزامی است!',
      })
      .refine((data) => data !== '', {
        message: props?.message?.required_error ?? 'فیلد الزامی است!',
      }),
  /**
   * boolean
   * defaultValue === false
   */
  boolean: (props) =>
    zod.coerce.boolean().refine((bool) => bool === true, {
      message: props?.message?.required_error ?? 'Switch is required!',
    }),
  /**
   * file
   * defaultValue === '' || null
   */
  file: (props) =>
    zod
      .any()
      .optional()
      .transform((data, ctx) => {
        if (data === undefined || data === null || data === '') return null;

        const hasFile = data instanceof File || (typeof data === 'string' && !!data.length);

        if (!hasFile) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.required_error ?? 'فایل الزامی است!',
          });
          return null;
        }

        return data;
      }),

  /**
   * files
   * defaultValue === []
   */
  files: (props) =>
    zod.array(zod.custom()).transform((data, ctx) => {
      const minFiles = props?.minFiles ?? 1;

      if (!data.length) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? 'فایل الزامی است!',
        });
      } else if (data.length < minFiles) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `Must have at least ${minFiles} items!`,
        });
      }

      return data;
    }),
};
