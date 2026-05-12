'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import logo from '@/assets/MEDConSARL_logo.png'

const Footer = () => {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  if (pathname?.startsWith('/admin')) return null

  const quickLinks = [
    { name: 'home', href: '/' },
    { name: 'about', href: '/about' },
    { name: 'services', href: '/services' },
    { name: 'portfolio', href: '/portfolio' },
    { name: 'contact', href: '/contact' },
  ]

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/MEDCon01', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
  ]

  return (
    <footer className="bg-deep-space-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="mb-4">
              <Image src={logo} alt="MEDCon SARL" width={160} height={64} className="h-14 w-auto md:h-16" />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-yellow-green-400" />
                <span>{t('contact.locationText')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-yellow-green-400" />
                <a href="tel:+237671911489" className="hover:text-white transition-colors">+237 671 911 489</a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-yellow-green-400" />
                <a href="mailto:medconsarl@gmail.com" className="hover:text-white transition-colors">medconsarl@gmail.com</a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-yellow-green-400">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {t(`nav.${link.name}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-yellow-green-400">{t('footer.services')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>{t('services.construction.title')}</li>
              <li>{t('services.renovation.title')}</li>
              <li>{t('services.interior.title')}</li>
              <li>{t('services.realEstate.title')}</li>
              <li>{t('services.generalMerchandise.title')}</li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">{t('footer.followUs')}</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-deep-space-blue-800 rounded-full flex items-center justify-center hover:bg-yellow-green-500 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-deep-space-blue-800 mt-8 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} MEDCon SARL. {t('footer.rights')}
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer