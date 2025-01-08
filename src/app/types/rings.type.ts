export interface Ring {
    id: string;
    imageSrc: string;
    title: string;
    width: string;
    weight: string;
}
  
export interface RingsCategory {
    id: string;
    name: string;
    imageSrc: string;
    rings: Ring[];
}
  