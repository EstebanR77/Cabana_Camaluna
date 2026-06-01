export function dateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseApiDate(value) {
  if (!value) return null
  const parsed = new Date(`${String(value).slice(0, 10)}T12:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function buildBlockedDateSet(reservations = []) {
  const blocked = new Set()

  reservations.forEach(reservation => {
    if (!reservation || reservation.status === 'rejected' || reservation.status === 'cancelled') {
      return
    }

    const start = parseApiDate(reservation.checkIn)
    const end = parseApiDate(reservation.checkOut)
    if (!start || !end) return

    const cursor = new Date(start)
    while (cursor < end) {
      blocked.add(dateKey(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
  })

  return blocked
}

export function isPastDate(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return target < today
}

export function isDateBlocked(date, blockedSet) {
  return isPastDate(date) || blockedSet.has(dateKey(date))
}

export function rangeOverlapsBlocked(start, end, blockedSet) {
  if (!start || !end) return false

  const cursor = new Date(start)
  cursor.setHours(0, 0, 0, 0)
  const last = new Date(end)
  last.setHours(0, 0, 0, 0)

  while (cursor < last) {
    if (blockedSet.has(dateKey(cursor))) return true
    cursor.setDate(cursor.getDate() + 1)
  }

  return false
}
