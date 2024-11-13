export class CreateCustomerDto {
  email!: string;
  businessId!: number;
  name!: string;
  phone!: string;
  address!: string;
  company!: string;
  dateMet!: Date;
  dayBirth!: Date;
  furigana!: string;
  hearAbout: '紹介' | '訪問' | 'ネット' | 'その他' = '紹介';
  customerId!: number;
  lastContact!: Date;
  nextContact!: Date;
  notes?: string;
  methodMet: '紹介' | '訪問' | 'ネット' | 'その他' = '紹介';
  position!: string;
  languagePreference:
    | '日本語'
    | '英語'
    | '中国語'
    | '韓国語'
    | 'スペイン語'
    | 'フランス語'
    | 'ドイツ語'
    | 'その他' = '日本語';
  supportDetails?: string;
  supportRequired: 'なし' | 'あり' = 'なし';
  supportSatisfaction!: number;
  preferredContactMethod: '電話' | 'メール' | '訪問' | 'その他' = '電話';
}
