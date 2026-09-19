import ResourceListPage from '../components/resource/ResourceListPage'
import { pressApi } from '../lib/api'
import { columns, fields, schema } from '../config/press.js'

export default function Press() {
  return (
    <ResourceListPage title="Press coverage" api={pressApi} columns={columns} fields={fields} schema={schema} createLabel="New press item" />
  )
}
