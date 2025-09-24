import { getHttp } from '../http'

export async function getUsers() {
  const http = getHttp()
  return await http('/api/users', {
    method: 'GET',
  })
}
