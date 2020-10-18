import passportJwt, { StrategyOptions } from 'passport-jwt'
import User from '../models/User'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt
const secretKey = `${process.env.JWT}`

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: `dev-jwt`,
}

export default (passport: any) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.findById(payload.userId).select('email id')

        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      } catch (error) {
        console.log(error)
      }
    })
  )
}