export const contactHero = {
  title: 'Ayuda',
  subtitle: 'Estamos disponibles para ayudarte y resolver cualquier duda sobre tu estadía en CAMALUNA.',
}

export const contactInfo = [
  {
    icon: 'gavel',
    label: 'Numero de registro Nacional de Turismo',
    value: '262314',
  },
  {
    icon: 'mail',
    label: 'Correo electrónico',
    value: 'camaluna@gmail.com',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=camaluna@gmail.com&su=Consulta%20sobre%20Camaluna',
    target: '_blank',
  },
  {
    icon: 'pin',
    label: 'Ubicación',
    value: 'Villa de Leyva, Boyacá — Colombia.',
    href: 'https://www.google.com/maps?q=Villa+de+Leyva,+Boyac%C3%A1,+Colombia',
    target: '_blank',
  },
]

export const socialNetworks = {
  title: 'Redes Sociales',
  items: [
    {
      icon: 'whatsapp',
      title: 'WhatsApp',
      desc: 'Contacto directo, rapido y fácil',
      href: 'https://wa.me/573107777579',
    },
    {
      icon: 'instagram',
      title: 'Instagram',
      desc: 'Fotos, novedades y momentos especiales de la cabaña.',
      href: 'https://instagram.com/camaluna',
    },
  ],
}

export const emergencyContacts = {
  title: 'Contactos de Emergencia',
  items: [
    { icon: 'siren',     title: 'Policia Nacional', number: '123', placeholder: 'Número' },
    { icon: 'hospital',  title: 'Hospital',         number: '125', placeholder: 'Número' },
    { icon: 'firetruck', title: 'Bomberos',         number: '119', placeholder: 'Número' },
  ],
}

export const faqs = {
  title: 'Preguntas Frecuentes',
  items: [
    { icon: 'clock',    q: '¿Cuál es el horario de check-in y check-out?',  a: 'Check-in desde las 3:00 PM y check-out hasta las 12:00 PM.' },
    { icon: 'car',      q: '¿La cabaña cuenta con parqueadero?',            a: 'Sí, contamos con espacio gratuito dentro de la propiedad.' },
    { icon: 'map',      q: '¿Qué tan lejos está del casco urbano?',         a: 'A 7 minutos en carro del centro histórico de Villa de Leyva.' },
    { icon: 'paw',      q: '¿Aceptan mascotas?',                            a: 'Consulta por WhatsApp; analizamos cada caso.' },
    { icon: 'sparkle',  q: '¿Cómo se confirma la reserva?',                 a: 'Con el 50% de anticipo por transferencia. Recibirás la confirmación de inmediato.' },
    { icon: 'plus',     q: '¿Qué incluye el hospedaje?',                    a: 'Alojamiento, ropa de cama, toallas, cocina equipada y WiFi.' },
    { icon: 'person',   q: '¿Cómo ingreso a la cabaña?',                    a: 'Te enviamos las indicaciones e instrucciones de acceso el día de tu llegada.' },
  ],
}

export const contactCta = {
  title: '¿Listos para vivir la aventura?',
  subtitle: 'Reserva tu estancia y vive la experiencia de Villa de leyva desde nuestra cabaña',
  ctaText: 'RESERVA YA!',
  ctaLink: '/reserve',
}
