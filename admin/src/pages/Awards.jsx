import ResourceListPage from '../components/resource/ResourceListPage'
import { awardsApi } from '../lib/api'
import { columns, fields, schema } from '../config/awards.js'

export default function Awards() {
  return (
    <ResourceListPage title="Award" api={awardsApi} columns={columns} fields={fields} schema={schema} createLabel="New award" />
  )
}
