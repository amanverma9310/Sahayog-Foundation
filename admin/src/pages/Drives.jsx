import ResourceListPage from '../components/resource/ResourceListPage'
import { drivesApi } from '../lib/api'
import { columns, fields, schema } from '../config/drives.js'

export default function Drives() {
  return (
    <ResourceListPage title="Drive" api={drivesApi} columns={columns} fields={fields} schema={schema} createLabel="New drive" />
  )
}
