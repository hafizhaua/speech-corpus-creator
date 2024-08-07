export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audios: {
        Row: {
          audio_url: string | null
          created_at: string
          file_name: string | null
          id: number
          lang_code: string | null
          transcription: string | null
          type: Database["public"]["Enums"]["audio_type"] | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          file_name?: string | null
          id?: number
          lang_code?: string | null
          transcription?: string | null
          type?: Database["public"]["Enums"]["audio_type"] | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          file_name?: string | null
          id?: number
          lang_code?: string | null
          transcription?: string | null
          type?: Database["public"]["Enums"]["audio_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "audios_lang_code_fkey"
            columns: ["lang_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["lang_code"]
          },
        ]
      }
      languages: {
        Row: {
          country_code: string | null
          country_name: string
          created_at: string | null
          id: string
          lang_code: string
          lang_name: string
          updated_at: string | null
        }
        Insert: {
          country_code?: string | null
          country_name: string
          created_at?: string | null
          id?: string
          lang_code: string
          lang_name: string
          updated_at?: string | null
        }
        Update: {
          country_code?: string | null
          country_name?: string
          created_at?: string | null
          id?: string
          lang_code?: string
          lang_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mos_results: {
        Row: {
          audio_id: number | null
          created_at: string | null
          id: string
          naturalness_scale: number | null
          quality_scale: number | null
          respondent_id: string | null
        }
        Insert: {
          audio_id?: number | null
          created_at?: string | null
          id?: string
          naturalness_scale?: number | null
          quality_scale?: number | null
          respondent_id?: string | null
        }
        Update: {
          audio_id?: number | null
          created_at?: string | null
          id?: string
          naturalness_scale?: number | null
          quality_scale?: number | null
          respondent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mos_results_audio_id_fkey"
            columns: ["audio_id"]
            isOneToOne: false
            referencedRelation: "audios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mos_results_audio_id_fkey"
            columns: ["audio_id"]
            isOneToOne: false
            referencedRelation: "random_audios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mos_results_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "respondents"
            referencedColumns: ["id"]
          },
        ]
      }
      respondents: {
        Row: {
          age: number | null
          created_at: string
          email: string
          fullname: string
          gender: string | null
          id: string
          institution: string
          native_lang_code: string | null
          req_agreement: boolean
          req_headset: boolean | null
          req_impairment: boolean
          req_language: boolean
        }
        Insert: {
          age?: number | null
          created_at?: string
          email: string
          fullname: string
          gender?: string | null
          id?: string
          institution: string
          native_lang_code?: string | null
          req_agreement: boolean
          req_headset?: boolean | null
          req_impairment: boolean
          req_language: boolean
        }
        Update: {
          age?: number | null
          created_at?: string
          email?: string
          fullname?: string
          gender?: string | null
          id?: string
          institution?: string
          native_lang_code?: string | null
          req_agreement?: boolean
          req_headset?: boolean | null
          req_impairment?: boolean
          req_language?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "respondents_native_lang_code_fkey"
            columns: ["native_lang_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["lang_code"]
          },
        ]
      }
      utterance_sets: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_visible: boolean | null
          language_id: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          utterances: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          is_visible?: boolean | null
          language_id?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          utterances: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_visible?: boolean | null
          language_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          utterances?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_utterance_sets_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      random_audios: {
        Row: {
          audio_url: string | null
          created_at: string | null
          id: number | null
          lang_code: string | null
          transcription: string | null
          type: Database["public"]["Enums"]["audio_type"] | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          id?: number | null
          lang_code?: string | null
          transcription?: string | null
          type?: Database["public"]["Enums"]["audio_type"] | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          id?: number | null
          lang_code?: string | null
          transcription?: string | null
          type?: Database["public"]["Enums"]["audio_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "audios_lang_code_fkey"
            columns: ["lang_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["lang_code"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      audio_type: "synthesized" | "natural"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
