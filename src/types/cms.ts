// CMS Types for Cake Shop Management

export interface CmsContent {
  _id: string;
  key: string;
  title: string;
  content: any;
  type: ContentType;
  language: string;
  version: number;
  status: ContentStatus;
  author: string;
  lastModified: Date;
  createdAt: Date;
  seoMeta?: SeoMeta;
}

export enum ContentType {
  TEXT = 'text',
  RICH_TEXT = 'rich_text',
  IMAGE = 'image',
  GALLERY = 'gallery',
  VIDEO = 'video',
  BANNER = 'banner',
  PRODUCT = 'product',
  CATEGORY = 'category',
  PAGE = 'page'
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface CmsProduct extends IProduct {
  healthAttributes?: HealthAttribute[];
  ingredients?: Ingredient[];
  nutrition?: NutritionInfo;
  allergens?: Allergen[];
  healthBenefits?: string[];
  customizations?: ProductCustomization[];
}

export interface HealthAttribute {
  _id: string;
  name: string;
  value: string;
  icon?: string;
  description?: string;
  verified: boolean;
}

export interface Ingredient {
  _id: string;
  name: string;
  quantity?: string;
  unit?: string;
  allergenInfo?: string[];
  isOrganic?: boolean;
  origin?: string;
}

export interface NutritionInfo {
  servingSize: string;
  calories: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  additionalInfo?: { [key: string]: number | string };
}

export interface Allergen {
  _id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  description?: string;
}

export interface ProductCustomization {
  _id: string;
  name: string;
  type: 'text' | 'select' | 'checkbox' | 'number';
  options?: string[];
  required: boolean;
  additionalCost?: number;
}

export interface CmsBanner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: ImageInfo;
  mobileImage?: ImageInfo;
  link?: string;
  buttonText?: string;
  position: BannerPosition;
  priority: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  targetAudience?: string[];
}

export enum BannerPosition {
  HERO = 'hero',
  SECONDARY = 'secondary',
  SIDEBAR = 'sidebar',
  FOOTER = 'footer',
  POPUP = 'popup'
}

export interface CmsPage {
  _id: string;
  title: string;
  slug: string;
  content: any;
  template: PageTemplate;
  seoMeta: SeoMeta;
  isPublished: boolean;
  author: string;
  lastModified: Date;
  createdAt: Date;
}

export enum PageTemplate {
  DEFAULT = 'default',
  ABOUT = 'about',
  CONTACT = 'contact',
  FAQ = 'faq',
  BLOG = 'blog'
}

export interface ContentVersion {
  _id: string;
  contentId: string;
  version: number;
  content: any;
  author: string;
  createdAt: Date;
  notes?: string;
}

export interface CmsSettings {
  _id: string;
  siteName: string;
  tagline: string;
  logo: ImageInfo;
  favicon: ImageInfo;
  primaryColor: string;
  secondaryColor: string;
  fonts: FontSettings;
  socialMedia: SocialMediaLinks;
  contactInfo: ContactInfo;
  businessHours: BusinessHours[];
  languages: string[];
  defaultLanguage: string;
  enableMultilingual: boolean;
}

export interface FontSettings {
  primary: string;
  secondary: string;
  sizes: { [key: string]: string };
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface CmsUser {
  _id: string;
  role: CmsRole;
  permissions: Permission[];
  lastLogin: Date;
  isActive: boolean;
}

export enum CmsRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  CONTRIBUTOR = 'contributor'
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface CmsAnalytics {
  _id: string;
  event: string;
  userId?: string;
  resource: string;
  resourceId: string;
  details: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface CmsBackup {
  _id: string;
  type: 'manual' | 'automatic';
  description: string;
  filePath: string;
  size: number;
  createdAt: Date;
  createdBy: string;
}

export interface FileUpload {
  _id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags?: string[];
  description?: string;
}

export interface EditorState {
  isEditing: boolean;
  currentContent: any;
  isDirty: boolean;
  autoSaveEnabled: boolean;
  lastSaved?: Date;
}

export interface CmsDashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  revenue: number;
  recentActivities: CmsAnalytics[];
  popularProducts: IProduct[];
  lowStockProducts: IProduct[];
}

// Import existing types
import { IProduct, ImageInfo } from './index';
