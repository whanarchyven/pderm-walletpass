import { PreConfiguredService } from "@/src/service/precon/Pre";

export interface DocxTemplatePreConfiguredServiceOptions {
  docxTemplateFilePath: string;
}
export class DocxTemplatePreConfiguredService extends PreConfiguredService<DocxTemplatePreConfiguredServiceOptions> {}
