import { Timestamp } from 'firebase-admin/firestore'

export interface Blog {
  id: string
  title: string
  createdBy: string
  createdDate: Timestamp
  updatedDate?: Timestamp
  headerImg: string
  content: string
}

export interface Form {
  id?: string
  name: string
  phone: string
  email: string
  caseDescription: string
  createdDate: Timestamp
}

export interface TeamMember {
  uid: string
  name: string
  title: string
  education: string[]
  description: string
  phone: string
  email: string
  photoUrl: string
}
