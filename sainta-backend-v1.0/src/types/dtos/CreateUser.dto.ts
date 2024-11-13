export class CreateUserDto {
  email!: string;
  username!: string;
  password!: string;
  phone!: string;
  dob!: Date;
  fullName!: string;
  furigana!: string;
  gender: 'Male' | 'Female' = 'Male';
  businessId!: number;
  employeeId!: number;
  companyName!: string;
  location!: string;
  website?: string | null;
  service: 'Gyoumu' | 'BoshuuRecruiter' | 'BoshuuJobseeker' | 'Rabo' = 'Gyoumu';
  contractPeriod: 'Monthly' | 'Yearly' = 'Monthly';
}
