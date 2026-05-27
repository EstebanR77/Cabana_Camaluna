import ContactHero       from '../components/ContactHero/ContactHero'
import ContactInfo       from '../components/ContactInfo/ContactInfo'
import SocialNetworks    from '../components/SocialNetworks/SocialNetworks'
import EmergencyContacts from '../components/EmergencyContacts/EmergencyContacts'
import FAQs              from '../components/FAQs/FAQs'
import CtaBanner         from '../components/CtaBanner/CtaBanner'
import Footer            from '../components/Footer/Footer'
import styles            from './Contact.module.css'

import {
  contactHero,
  contactInfo,
  socialNetworks,
  emergencyContacts,
  faqs,
  contactCta,
} from '../data/contactData'

function Contact() {
  return (
    <div className={styles.page}>
      <ContactHero       {...contactHero} />
      <ContactInfo       items={contactInfo} />
      <SocialNetworks    {...socialNetworks} />
      <EmergencyContacts {...emergencyContacts} />
      <FAQs              {...faqs} />
      <CtaBanner         {...contactCta} />
      <Footer variant="orange" />
    </div>
  )
}

export default Contact
