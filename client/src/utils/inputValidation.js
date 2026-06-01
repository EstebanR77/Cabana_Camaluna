export const LIMITS = {
  firstName: 50,
  lastName: 50,
  fullName: 80,
  email: 120,
  phone: 20,
  notes: 500,
  documentNumber: 16,
  requestCode: 20,
  ageMax: 120,
  ageMinAdult: 13,
  ageMaxChild: 12,
  ageMinChild: 2,
}

export const VALID_DOCUMENT_TYPES = ['CC', 'CE', 'Pasaporte', 'TI']

const PERSON_NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[\d+\s()-]{7,20}$/
const DOCUMENT_REGEX = /^[a-zA-Z0-9]{4,16}$/
const REQUEST_CODE_REGEX = /^\d{8,20}$/

const INJECTION_PATTERN = /[<>'"`;\\]|javascript:|on\w+\s*=/gi

export function containsInjectionAttempt(value) {
  return INJECTION_PATTERN.test(String(value || ''))
}

export function filterPersonName(value, maxLen = LIMITS.firstName) {
  return String(value || '')
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, maxLen)
}

export function filterEmail(value) {
  return String(value || '')
    .replace(/[^\w.@+-]/g, '')
    .slice(0, LIMITS.email)
}

export function filterPhone(value) {
  return String(value || '')
    .replace(/[^\d+\s()-]/g, '')
    .slice(0, LIMITS.phone)
}

export function filterNumeric(value, maxLen = LIMITS.requestCode) {
  return String(value || '').replace(/\D/g, '').slice(0, maxLen)
}

export function filterDocumentNumber(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, LIMITS.documentNumber)
}

export function filterAge(value) {
  return filterNumeric(value, 3)
}

export function filterNotes(value) {
  return String(value || '')
    .replace(INJECTION_PATTERN, '')
    .replace(/[^\w\sáéíóúÁÉÍÓÚñÑüÜ.,!?¿¡()\-@#%&+/:]/g, '')
    .slice(0, LIMITS.notes)
}

export function filterDocumentType(value) {
  return VALID_DOCUMENT_TYPES.includes(value) ? value : 'CC'
}

export function validatePersonName(value, label = 'Este campo') {
  const trimmed = value?.trim() || ''
  if (!trimmed) return `Ingresa ${label.toLowerCase()}.`
  if (containsInjectionAttempt(trimmed)) {
    return 'Caracteres no permitidos por seguridad.'
  }
  if (trimmed.length < 2) return `${label}: mínimo 2 caracteres.`
  if (!PERSON_NAME_REGEX.test(trimmed)) {
    return `${label}: solo letras, espacios y guiones.`
  }
  return ''
}

export function validateEmail(email) {
  const value = email?.trim() || ''
  if (!value) return 'Ingresa tu correo electrónico.'
  if (containsInjectionAttempt(value)) {
    return 'El correo contiene caracteres no permitidos.'
  }
  if (value.length > LIMITS.email || !EMAIL_REGEX.test(value)) {
    return 'Ingresa un correo electrónico válido (ejemplo: nombre@correo.com).'
  }
  return ''
}

export function validatePhone(phone) {
  const value = phone?.trim() || ''
  if (!value) return 'Ingresa tu número de teléfono.'
  if (containsInjectionAttempt(value)) {
    return 'El teléfono contiene caracteres no permitidos.'
  }
  if (!PHONE_REGEX.test(value)) {
    return 'Ingresa un teléfono válido (7 a 20 dígitos, puedes usar +).'
  }
  return ''
}

export function validateNotes(notes) {
  const value = notes?.trim() || ''
  if (!value) return ''
  if (containsInjectionAttempt(value)) {
    return 'El texto contiene caracteres no permitidos por seguridad.'
  }
  return ''
}

export function validateAge(ageStr, guestKey) {
  if (ageStr === '' || ageStr === undefined || ageStr === null) {
    return 'Ingresa la edad del huésped.'
  }

  if (!/^\d{1,3}$/.test(String(ageStr))) {
    return 'La edad debe ser un número sin letras ni símbolos.'
  }

  const age = Number(ageStr)
  if (!Number.isFinite(age)) return 'Ingresa una edad válida.'

  if (guestKey.startsWith('adulto-')) {
    if (age < LIMITS.ageMinAdult) {
      return 'Los adultos deben tener al menos 13 años.'
    }
    if (age > LIMITS.ageMax) {
      return 'Ingresa una edad menor o igual a 120 años.'
    }
    return ''
  }

  if (guestKey.startsWith('nino-')) {
    if (age < LIMITS.ageMinChild) {
      return 'Los niños deben tener al menos 2 años.'
    }
    if (age > LIMITS.ageMaxChild) {
      return 'Los niños deben tener como máximo 12 años.'
    }
    return ''
  }

  if (age < 0 || age > LIMITS.ageMax) {
    return 'Ingresa una edad entre 0 y 120 años.'
  }

  return ''
}

export function validateDocumentNumber(value) {
  const doc = value?.trim() || ''
  if (!doc) return 'Ingresa el número de documento.'
  if (containsInjectionAttempt(doc)) {
    return 'El documento contiene caracteres no permitidos.'
  }
  if (!DOCUMENT_REGEX.test(doc)) {
    return 'Usa entre 4 y 16 caracteres alfanuméricos (sin espacios).'
  }
  return ''
}

export function validateDocumentType(value) {
  if (!VALID_DOCUMENT_TYPES.includes(value)) {
    return 'Selecciona un tipo de documento válido.'
  }
  return ''
}

export function validateTitularFields(titular) {
  const errors = {}
  const nombresError = validatePersonName(titular.nombres, 'Los nombres')
  const apellidosError = validatePersonName(titular.apellidos, 'Los apellidos')

  if (nombresError) errors['titular.nombres'] = nombresError
  if (apellidosError) errors['titular.apellidos'] = apellidosError

  return errors
}

export function validateTitular(titular) {
  const errors = validateTitularFields(titular)
  return Object.keys(errors).length === 0 ? '' : Object.values(errors)[0]
}

export function validateStep1({ range, rangeError, titular, pricing }) {
  const errors = { ...validateTitularFields(titular) }

  if (!range?.start || !range?.end) {
    errors.fechas = 'Selecciona las fechas de check-in y check-out.'
  } else if (rangeError) {
    errors.fechas = rangeError
  }

  if (!pricing?.nights || pricing.nights <= 0) {
    errors.fechas = errors.fechas || 'El rango de fechas debe incluir al menos una noche.'
  }

  return errors
}

export function validateGuestProfileFields(profile, guestKey) {
  const errors = {}
  const label = guestKey.startsWith('nino-') ? 'Huésped niño' : 'Huésped adulto'

  const nameError = validatePersonName(profile.nombreCompleto, `${label}: nombre completo`)
  if (nameError) errors[`${guestKey}.nombreCompleto`] = nameError

  const docTypeError = validateDocumentType(profile.tipoDocumento)
  if (docTypeError) errors[`${guestKey}.tipoDocumento`] = docTypeError

  const docNumError = validateDocumentNumber(profile.numeroDocumento)
  if (docNumError) errors[`${guestKey}.numeroDocumento`] = docNumError

  const ageError = validateAge(profile.edad, guestKey)
  if (ageError) errors[`${guestKey}.edad`] = ageError

  return errors
}

export function validateGuestProfile(profile, label) {
  const key = label.includes('niño') ? 'nino-0' : 'adulto-0'
  const errors = validateGuestProfileFields(profile, key)
  return Object.values(errors)[0] || ''
}

export function validateStep2({ form, guests, guestProfiles }) {
  const errors = {}

  const emailError = validateEmail(form.email)
  if (emailError) errors.email = emailError

  const phoneError = validatePhone(form.telefono)
  if (phoneError) errors.telefono = phoneError

  const notesError = validateNotes(form.solicitudes)
  if (notesError) errors.solicitudes = notesError

  buildGuestKeysFromGuests(guests).forEach(key => {
    const profile = guestProfiles[key] || {}
    Object.assign(errors, validateGuestProfileFields(profile, key))
  })

  return errors
}

export function buildGuestKeysFromGuests(guests) {
  const keys = []
  for (let i = 0; i < (guests.adultos || 1); i += 1) {
    keys.push(`adulto-${i}`)
  }
  for (let i = 0; i < (guests.ninos || 0); i += 1) {
    keys.push(`nino-${i}`)
  }
  return keys
}

export function validateSingleField(fieldKey, value, context = {}) {
  switch (fieldKey) {
    case 'titular.nombres':
      return validatePersonName(value, 'Los nombres')
    case 'titular.apellidos':
      return validatePersonName(value, 'Los apellidos')
    case 'email':
      return validateEmail(value)
    case 'telefono':
      return validatePhone(value)
    case 'solicitudes':
      return validateNotes(value)
    default:
      break
  }

  if (fieldKey.endsWith('.nombreCompleto')) {
    return validatePersonName(value, 'El nombre completo')
  }
  if (fieldKey.endsWith('.numeroDocumento')) {
    return validateDocumentNumber(value)
  }
  if (fieldKey.endsWith('.tipoDocumento')) {
    return validateDocumentType(value)
  }
  if (fieldKey.endsWith('.edad')) {
    const guestKey = fieldKey.replace('.edad', '')
    return validateAge(value, guestKey)
  }

  return ''
}

export function validateLookupForm(holderName, requestCode) {
  const errors = {}
  const nameError = validatePersonName(holderName, 'El nombre del titular')
  const code = requestCode.trim()

  if (nameError) errors.holderName = nameError
  if (!code) {
    errors.requestCode = 'Ingresa el código de solicitud.'
  } else if (!REQUEST_CODE_REGEX.test(code)) {
    errors.requestCode = 'El código debe ser numérico (8 a 20 dígitos).'
  }

  return errors
}

export function validatePaymentFile(file) {
  if (!file) return 'Debes adjuntar el comprobante de pago.'

  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ]

  if (!allowed.includes(file.type)) {
    return 'Formato no permitido. Usa imagen (JPG, PNG, WEBP) o PDF.'
  }

  if (file.size > 5 * 1024 * 1024) {
    return 'El archivo no puede superar 5 MB.'
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
  if (!safeName) return 'Nombre de archivo inválido.'

  if (containsInjectionAttempt(file.name)) {
    return 'El nombre del archivo contiene caracteres no permitidos.'
  }

  return ''
}
