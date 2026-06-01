const SEASON_PRICES = {
  alta: 350000,
  media: 280000,
  baja: 220000,
}

const SEASON_LABELS = {
  alta: 'Temporada alta',
  media: 'Temporada media',
  baja: 'Temporada baja',
}

/** Temporadas según reserveData.js */
export function getSeasonKey(date) {
  const month = date.getMonth()

  if (month === 0 || month === 11) return 'alta'
  if ([2, 3, 4, 7, 8, 9].includes(month)) return 'media'
  return 'baja'
}

export function getNightlyPrice(date) {
  return SEASON_PRICES[getSeasonKey(date)]
}

export function calculateStayPrice(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return { nights: 0, total: 0, seasonLabel: '—', avgPerNight: 0 }
  }

  const nights = Math.round((checkOut - checkIn) / 86400000)
  if (nights <= 0) {
    return { nights: 0, total: 0, seasonLabel: '—', avgPerNight: 0 }
  }

  let total = 0
  const seasons = new Set()
  const cursor = new Date(checkIn)
  cursor.setHours(0, 0, 0, 0)
  const end = new Date(checkOut)
  end.setHours(0, 0, 0, 0)

  while (cursor < end) {
    const season = getSeasonKey(cursor)
    seasons.add(season)
    total += SEASON_PRICES[season]
    cursor.setDate(cursor.getDate() + 1)
  }

  const seasonLabel = seasons.size === 1
    ? SEASON_LABELS[[...seasons][0]]
    : 'Varias temporadas'

  return {
    nights,
    total,
    seasonLabel,
    avgPerNight: Math.round(total / nights),
  }
}

export function formatCop(amount) {
  return `$${Number(amount || 0).toLocaleString('es-CO')} COP`
}
