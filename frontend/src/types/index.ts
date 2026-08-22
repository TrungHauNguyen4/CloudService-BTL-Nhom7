// ===== Các kiểu dữ liệu mapping từ Backend DTOs =====

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface ServicePlan {
  id: string;
  name: string;
  slug: string;
  specs?: string;
  categoryId: string;
  category?: ServiceCategory;
  prices?: PlanPrice[];
  isActive: boolean;
}

export interface PlanPrice {
  id: string;
  planId: string;
  billingCycle: 'Monthly' | 'Yearly';
  price: number;
  originalPrice: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  authorName: string;
  publishedAt?: string;
  isPublished: boolean;
}

export interface CreateOrderDto {
  planId: string;
  serviceName: string;
  billingCycle: 'Monthly' | 'Yearly';
  customerName: string;
  email: string;
  phone: string;
}

export interface CreateAffiliateDto {
  fullName: string;
  email: string;
  phone: string;
  website?: string;
}
