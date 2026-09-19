import ResourceListPage from '../components/resource/ResourceListPage'
import { partnersApi } from '../lib/api'
import { columns, fields, schema } from '../config/partners.js'

export default function Partners() {
  return (
    <ResourceListPage title="Partner" api={partnersApi} columns={columns} fields={fields} schema={schema} createLabel="New partner" />
  )
}
