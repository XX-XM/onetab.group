import { sdb } from '@/utils/sdb'

export default defineEventHandler(async (event): Promise<any> => {
  const { email } = getQuery(event) as { email: string }

  let user = {}

  if (email) {
    const userList = await sdb.account.queryByEmail(email)
    user = userList[0]
  }

  return user
})
