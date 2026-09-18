import { useEffect, useState } from 'react'
import { FileText, Download, FolderOpen } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonLine } from '../components/ui/Skeleton'
import { getReports, getOrgInfo } from '../lib/api'

export default function Transparency() {
  const [reports, setReports] = useState(null)
  const [orgInfo, setOrgInfo] = useState(null)

  useEffect(() => {
    getReports().then(setReports).catch(() => setReports([]))
    getOrgInfo().then(setOrgInfo).catch(() => setOrgInfo(null))
  }, [])

  return (
    <>
      <Seo title="Transparency" description="Annual reports, audited financial statements, and legal registrations for Sahayog Foundation." path="/transparency" />
      <PageHero
        eyebrow="Accountability"
        title="Every report we file, in one place"
        description="Read these before you give, not after. We'd rather you decide with full information."
        image="https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=1800&auto=format&fit=crop"
      />

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Our commitment" title="What we publish, and how often" />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-sm bg-pine-50 p-6">
              <p className="font-display text-2xl text-pine-700">Quarterly</p>
              <p className="mt-1 text-sm text-moss">Per-project impact reporting</p>
            </div>
            <div className="rounded-sm bg-pine-50 p-6">
              <p className="font-display text-2xl text-pine-700">Annually</p>
              <p className="mt-1 text-sm text-moss">Audited financial statements</p>
            </div>
            <div className="rounded-sm bg-pine-50 p-6">
              <p className="font-display text-2xl text-pine-700">Always public</p>
              <p className="mt-1 text-sm text-moss">Registration and 80G documents</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper-dim py-20">
        <Container>
          <SectionHeading eyebrow="Documents" title="Download reports & registrations" />

          {!reports && (
            <div className="mt-10 space-y-3">
              <SkeletonLine className="h-16 w-full" />
              <SkeletonLine className="h-16 w-full" />
              <SkeletonLine className="h-16 w-full" />
            </div>
          )}

          {reports && reports.length === 0 && (
            <div className="mt-10 rounded-sm border border-pine-100 bg-white">
              <EmptyState
                icon={FolderOpen}
                title="No reports published yet"
                description="Once the admin team uploads annual reports, audits, or registration documents, they'll appear here for download."
              />
            </div>
          )}

          {reports && reports.length > 0 && (
            <div className="mt-10 divide-y divide-pine-100 rounded-sm border border-pine-100 bg-white">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-pine-50 text-pine-600">
                      <FileText size={18} />
                    </span>
                    <div>
                      <p className="font-medium text-pine-700">{report.title}</p>
                      <p className="text-sm text-moss">{report.type}{report.fileSizeLabel ? ` · ${report.fileSizeLabel}` : ''}</p>
                    </div>
                  </div>
                  <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-1.5 rounded-sm border border-pine-100 px-3.5 py-2 text-sm font-medium text-pine-700 hover:border-pine-300"
                    aria-label={`Download ${report.title}`}
                  >
                    <Download size={15} /> Download
                  </a>
                </div>
              ))}
            </div>
          )}

          {orgInfo && (
            <p className="mt-4 text-sm text-moss">
              {orgInfo.registrationNumber} · PAN {orgInfo.pan}
            </p>
          )}
        </Container>
      </section>
    </>
  )
}
