import { Item } from './item.model';

export interface CategoryItems {
  id: string;
  name: string;
  order: number;
  description?: string;
  items?: Array<Item>;
}
