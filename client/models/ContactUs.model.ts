export interface IContactUsModel {
    category?: string,
    description: string,
    email: string,
    subject: string,
    attachments?: File | EncodedFile
}

export interface EncodedFile {
    name: string;
    type: string;
    data: string;
  }