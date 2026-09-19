import ResourceListPage from '../components/resource/ResourceListPage'
import { testimonialsApi } from '../lib/api'
import { columns, fields, schema } from '../config/testimonials.jsx'

export default function Testimonials() {
  return (
    <ResourceListPage
      title="Testimonial"
      api={testimonialsApi}
      columns={columns}
      fields={fields}
      schema={schema}
      createLabel="New testimonial"
    />
  )
}
