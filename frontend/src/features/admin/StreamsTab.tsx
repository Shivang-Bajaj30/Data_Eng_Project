import { useState } from 'react'
import { useAdminStreams, useAdminEvents } from '../../api/useAdminApi'
import { Table, Button, Modal, KafkaTopicBadge, Badge, Card } from '../../components/ui'
import { Radio, Activity, Cpu, Database, RefreshCw, Eye } from 'lucide-react'
import type { KafkaStreamEvent } from '../../api/mockData'

export function StreamsTab() {
  const { data: streams, refetch: refetchStreams } = useAdminStreams()
  const { data: events = [], refetch: refetchEvents } = useAdminEvents()

  const [inspectEvent, setInspectEvent] = useState<KafkaStreamEvent | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([refetchStreams(), refetchEvents()])
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const columns = [
    {
      key: 'eventId',
      label: 'Event UUID',
      render: (val: string) => (
        <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
          {val}
        </span>
      ),
    },
    {
      key: 'topic',
      label: 'Kafka Topic',
      render: (val: string) => <KafkaTopicBadge topic={val} />,
    },
    {
      key: 'partition',
      label: 'Partition / Offset',
      render: (val: number, item: any) => (
        <span className="font-mono text-[11px] text-stone-500 dark:text-zinc-400">
          p{val} : #{item.offset}
        </span>
      ),
    },
    {
      key: 'key',
      label: 'Message Key',
      render: (val: string) => (
        <span className="font-mono text-xs text-stone-700 dark:text-zinc-300">
          {val}
        </span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Produced At',
      render: (val: string) => (
        <span className="text-xs text-stone-500 dark:text-zinc-400">
          {new Date(val).toLocaleTimeString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Payload',
      sortable: false,
      render: (_: any, item: KafkaStreamEvent) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInspectEvent(item)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Inspect JSON
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Cluster Health & Observability Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-stone-200/80 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-800 dark:text-zinc-200">
                Kafka Broker Cluster
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 mt-1">
              {streams?.status || 'HEALTHY'} (Lag: {streams?.consumerLag ?? 0})
            </span>
          </div>
        </Card>

        <Card className="p-4 border-stone-200/80 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-stone-500 dark:text-zinc-400 block">
              Stream Events Processed
            </span>
            <span className="text-lg font-bold font-mono text-stone-900 dark:text-zinc-100">
              {streams?.totalProcessed?.toLocaleString() || '18,452'}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-stone-200/80 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-stone-600 dark:text-zinc-300 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-stone-500 dark:text-zinc-400 block">
              Active Host Instance
            </span>
            <span className="text-xs font-mono font-semibold text-stone-800 dark:text-zinc-200 truncate block max-w-[150px]">
              {streams?.instance || 'oracle-vm-1'}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-stone-200/80 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-stone-500 dark:text-zinc-400 block">
              Configured Topics
            </span>
            <span className="text-xs font-semibold text-stone-800 dark:text-zinc-200">
              5 Topics Partitioned
            </span>
          </div>
        </Card>
      </div>

      {/* Stream Mirror Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 pb-2 border-b border-emerald-100 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Kafka Live Event Mirror</span>
            <Badge tone="stream" size="sm">
              Real-time Ingestion
            </Badge>
          </h3>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
            Mirroring audit, reputation, download, and note upload mutations across the distributed stream pipeline.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleManualRefresh}
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Stream
        </Button>
      </div>

      {/* Event Stream Table */}
      <Table
        columns={columns}
        data={events}
        searchPlaceholder="Filter stream events by key, UUID, or topic..."
        emptyTitle="No stream events received"
        emptyMessage="The event mirror will automatically stream actions as users interact with NoteVault."
      />

      {/* JSON Payload Inspector Modal */}
      <Modal
        open={!!inspectEvent}
        onClose={() => setInspectEvent(null)}
        maxWidth="lg"
        title={
          <div className="flex items-center gap-2 font-mono text-xs">
            <Radio className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Event Payload: {inspectEvent?.eventId}</span>
          </div>
        }
        description={`Topic: ${inspectEvent?.topic} · Partition: ${inspectEvent?.partition} · Offset: ${inspectEvent?.offset}`}
      >
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-zinc-400">
            <span>Timestamp: {inspectEvent?.timestamp}</span>
            <span className="font-mono">Key: {inspectEvent?.key}</span>
          </div>

          <pre className="p-4 rounded-xl bg-stone-950 text-stone-100 font-mono text-xs overflow-x-auto border border-stone-800 max-h-80 leading-relaxed">
            {JSON.stringify(inspectEvent?.payload, null, 2)}
          </pre>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setInspectEvent(null)}>
              Close Inspector
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
