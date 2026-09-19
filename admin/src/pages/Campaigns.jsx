import ResourceListPage from '../components/resource/ResourceListPage'
import { campaignsApi } from '../lib/api'
import { columns, fields, schema } from '../config/campaigns.js'

export default function Campaigns() {
  return (
    <ResourceListPage title="Campaign" api={campaignsApi} columns={columns} fields={fields} schema={schema} createLabel="New campaign" />
  )
}
