import { sdb } from '@/services/sdb'

export default defineEventHandler(async (event) => {
  const { sessionId, sessionItem } = await readBody(event)
  let [data, message] = [null, null]

  try {
    delete sessionItem.checked
    sessionItem.updated_at = new Date().getTime()
    const { data: sessionList, error } = await sdb.session.updateById(
      sessionId,
      sessionItem
    )
    data = sessionList
    message = error
  } catch (error) {
    console.log(error)
  }

  return {
    data,
    error: !!message,
    message
  }
})
