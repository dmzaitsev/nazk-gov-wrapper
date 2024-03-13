export interface DocumentList {
  data: Document[];
  count: number;
  notice: string;
}

export interface Document {
  continue_perform_functions: number;
  corruption_affected: number;
  data: any;
  declaration_type: number;
  declaration_year: number;
  id: string;
  options: any;
  post_category: number;
  post_type: number;
  responsible_position: number;
  schema_version: number;
  type: number;
  user_declarant_id: number;
  date: string;
}
