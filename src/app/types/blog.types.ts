export interface Blog {
  id: number;
  image: string;
  title: {
    en: string;
    de: string;
    sq: string;
  };
  content: {
    en: string;
    de: string;
    sq: string;
  };
  slug: string;
  metaDescription?: {
    en: string;
    de: string;
    sq: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlog {
  image: string;
  title: {
    en: string;
    de: string;
    sq: string;
  };
  content: {
    en: string;
    de: string;
    sq: string;
  };
  slug: string;
  metaDescription?: {
    en: string;
    de: string;
    sq: string;
  };
}
