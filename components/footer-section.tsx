'use client';
import React, { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Building } from 'lucide-react';
import { FaInstagram as Instagram, FaLinkedinIn as Linkedin, FaYoutube as Youtube, FaFacebookF as Facebook } from 'react-icons/fa';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Estates',
		links: [
			{ title: 'Luxury Villas', href: '#properties' },
			{ title: 'Penthouses', href: '#properties' },
			{ title: 'Private Islands', href: '#properties' },
			{ title: 'New Developments', href: '#properties' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'About LUXE', href: '#about' },
			{ title: 'Our Agents', href: '#agents' },
			{ title: 'Press & Media', href: '#press' },
			{ title: 'Careers', href: '#careers' },
		],
	},
	{
		label: 'Support',
		links: [
			{ title: 'Contact Us', href: '#contact' },
			{ title: 'Concierge Services', href: '#concierge' },
			{ title: 'Privacy Policy', href: '#privacy' },
			{ title: 'Terms of Service', href: '#terms' },
		],
	},
	{
		label: 'Connect',
		links: [
			{ title: 'Instagram', href: '#' },
			{ title: 'LinkedIn', href: '#' },
			{ title: 'YouTube', href: '#' },
			{ title: 'Facebook', href: '#' },
		],
	},
];

export function Footersection() {
	return (
		<footer className="relative w-full bg-[#0a0a0a] border-t border-neutral-900 px-6 py-16 lg:py-24 overflow-hidden z-10">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/10 via-transparent to-transparent z-0"></div>

			<div className="relative max-w-7xl mx-auto z-10">
				<div className="grid w-full gap-12 xl:grid-cols-4 xl:gap-8">
					<AnimatedContainer className="space-y-6 xl:col-span-1">
						<div className="flex items-center gap-2 mb-6">
							<div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
								<Building className="w-4 h-4 text-[#0a0a0a]" />
							</div>
							<span className="font-playfair text-2xl font-bold tracking-wider text-neutral-50">LUXE<span className="text-gold-400">.</span></span>
						</div>
						<p className="text-neutral-400 text-sm font-light leading-relaxed max-w-sm">
							Curating the world's most extraordinary properties for the most discerning clientele.
						</p>
					</AnimatedContainer>

					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-3 xl:ml-12">
						{footerLinks.map((section, index) => (
							<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
								<div className="mb-10 md:mb-0">
									<h3 className="text-xs font-bold tracking-widest uppercase text-gold-400 mb-6">{section.label}</h3>
									<ul className="text-neutral-400 space-y-4 text-sm font-light">
										{section.links.map((link) => (
											<li key={link.title}>
												<a
													href={link.href}
													className="hover:text-gold-400 inline-flex items-center transition-all duration-300"
												>
													{link.icon && <link.icon className="me-2 w-4 h-4" />}
													{link.title}
												</a>
											</li>
										))}
									</ul>
								</div>
							</AnimatedContainer>
						))}
					</div>
				</div>
				<AnimatedContainer delay={0.5} className="mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-neutral-500 text-xs tracking-wider">
						© {new Date().getFullYear()} LUXE Estates. All rights reserved.
					</p>
					<p className="text-neutral-500 text-xs tracking-wider">
						Designed with excellence.
					</p>
				</AnimatedContainer>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ translateY: 20, opacity: 0 }}
			whileInView={{ translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.6 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}