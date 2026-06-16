import type { Recipe } from './recipe';

export interface BackendResponse {
  data: Recipe[]; 
  total: number;   
}