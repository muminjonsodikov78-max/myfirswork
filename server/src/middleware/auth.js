export function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Tizimga kirish talab qilinadi' })
  }
  next()
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: 'Tizimga kirish talab qilinadi' })
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ error: 'Bu amal uchun ruxsat yo‘q' })
    }
    next()
  }
}
