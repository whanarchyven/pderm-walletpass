import { z } from "zod";

const SocialLink = z.object({
  key: z.string(),
  label: z.string(),
  value: z.string(),
});

const PngLogoUrl = z.object({
  "660x660": z.string().url(),
});
const PngImageUrl = z.object({
  "375x144": z.string().url(),
  "375x144@2x": z.string().url().optional(),
  "375x144@3x": z.string().url().optional(),
  "1032x336": z.string().url().optional(),
});

const FrontSide = z.object({
  qrCodeData: z.string().optional(),
  logoText: z.string().optional(),
  personStatus: z.string().optional(),
  expireDate: z.string().optional(),
  personName: z.string(),
  eventName: z.string().optional(),
  eventDate: z.string().optional(),
  eventTime: z.string().optional(),
  eventPlace: z.string().optional(),
  personPosition: z.string().optional(),
  pngLogoUrl: PngLogoUrl,
  pngImageUrl: PngImageUrl,
});

const BackSide = z.object({
  message: z.string().optional(),
  eventDesciption: z.string().optional(),
  supportPhone: z.string().optional(),
  siteLink: z.string().optional(),
  socialLinks: z.array(SocialLink).optional(),
});

const Welcome = z.object({
  title: z.string(),
  description: z.string(),
  ctaButtonText: z.string(),
});

const Fields = z.object({
  frontSide: FrontSide,
  backSide: BackSide.optional(),
});

const Styles = z.object({}).optional(); // Опциональное поле, структура пока неизвестна

export const ZodCreateOrUpdateCardInput = z.object({
  userUid: z.string(),
  welcome: Welcome.optional(),
  fields: Fields,
  styles: Styles,
});
export type CreateOrUpdateCardInput = z.infer<
  typeof ZodCreateOrUpdateCardInput
>;
