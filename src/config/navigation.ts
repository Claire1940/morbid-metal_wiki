import type { LucideIcon } from 'lucide-react'
import { Users, Star, BookOpen, Monitor, ShoppingCart, MessageSquare, Film } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'characters', path: '/characters', icon: Users, isContentType: true },
	{ key: 'feature', path: '/feature', icon: Star, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'platform', path: '/platform', icon: Monitor, isContentType: true },
	{ key: 'purchase', path: '/purchase', icon: ShoppingCart, isContentType: true },
	{ key: 'review', path: '/review', icon: MessageSquare, isContentType: true },
	{ key: 'trailer', path: '/trailer', icon: Film, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['characters', 'feature', 'guide', 'platform', 'purchase', 'review', 'trailer']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
