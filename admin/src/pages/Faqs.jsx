import ResourceListPage from '../components/resource/ResourceListPage'
import { faqsApi } from '../lib/api'
import { columns, fields, schema } from '../config/faqs.js'

export default function Faqs() {
  return (
    <ResourceListPage title="FAQ" api={faqsApi} columns={columns} fields={fields} schema={schema} createLabel="New FAQ" />
  )
}
