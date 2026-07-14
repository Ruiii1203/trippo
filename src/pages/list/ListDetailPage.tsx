import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CircleHelp, NotebookPen } from 'lucide-react'
import { useListStore } from '../../stores/useListStore'
import { useTripStore } from '../../stores/useTripStore'
import { listTypeConfig } from '../../data/mockLists'
import type { ListItem } from '../../types'

function ListDetailPage() {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const { lists, loaded, loadLists, toggleItemStatus, addListItem } = useListStore()
  const { addTrip } = useTripStore()

  const [newItemName, setNewItemName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (!loaded) {
      loadLists()
    }
  }, [loaded, loadLists])

  const list = lists.find((l) => l.id === listId)

  if (!list) {
    return (
      <div className="page">
        <header className="page-header">
          <button className="btn btn-ghost" onClick={() => navigate('/lists')}>
            ← 返回
          </button>
          <h1 className="page-title">清单详情</h1>
          <div style={{ width: 48 }} />
        </header>
        <div className="empty-state">
          <div className="empty-icon"><CircleHelp size={48} strokeWidth={1.5} /></div>
          <h3 className="empty-title">清单不存在</h3>
          <button className="btn btn-primary" onClick={() => navigate('/lists')}>
            返回列表
          </button>
        </div>
      </div>
    )
  }

  const config = listTypeConfig[list.type]

  const handleToggleStatus = (itemId: string, currentStatus: ListItem['status']) => {
    const statuses: ListItem['status'][] = ['pending', 'planned', 'completed']
    const currentIndex = statuses.indexOf(currentStatus)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]
    toggleItemStatus(listId!, itemId, nextStatus)
  }

  const handleAddItem = () => {
    if (!newItemName.trim()) return
    addListItem(listId!, { name: newItemName.trim() })
    setNewItemName('')
    setShowAddForm(false)
  }

  const handleConvertToTrip = () => {
    const pendingItems = list.items.filter((item) => item.status === 'pending' || item.status === 'planned')
    if (pendingItems.length === 0) return

    const destinations = [...new Set(pendingItems.map((item) => item.destination).filter(Boolean))] as string[]
    const destination = destinations.length > 0 ? destinations[0] : '未指定'

    const newTrip = addTrip({
      title: `${list.name}行程`,
      destination,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    })

    pendingItems.forEach((item) => {
      toggleItemStatus(listId!, item.id, 'planned')
    })

    navigate(`/trips/${newTrip.id}`)
  }

  const getStatusText = (status: ListItem['status']) => {
    switch (status) {
      case 'pending':
        return '想去'
      case 'planned':
        return '计划中'
      case 'completed':
        return '已完成'
      default:
        return ''
    }
  }

  const getStatusClass = (status: ListItem['status']) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'planned':
        return 'status-planned'
      case 'completed':
        return 'status-completed'
      default:
        return ''
    }
  }

  const completedCount = list.items.filter((item) => item.status === 'completed').length
  const percentage = list.items.length > 0 ? Math.round((completedCount / list.items.length) * 100) : 0

  return (
    <div className="page list-detail-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/lists')}>
          ← 返回
        </button>
        <h1 className="page-title">{list.name}</h1>
        <button className="btn btn-primary btn-sm" onClick={handleConvertToTrip}>
          转行程
        </button>
      </header>

      <div className="page-content">
        <div className="list-hero">
          <span className="list-hero-icon">{list.icon || config.icon}</span>
          <div className="list-hero-info">
            <h2 className="list-hero-title">{list.name}</h2>
            <p className="list-hero-desc">{list.description}</p>
          </div>
          <div className="list-hero-progress">
            <span className="progress-percentage">{percentage}%</span>
            <span className="progress-label">完成度</span>
          </div>
        </div>

        <div className="list-progress-bar">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${percentage}%`, backgroundColor: config.color }}
            />
          </div>
        </div>

        <div className="list-items-header">
          <h3 className="section-title">清单内容</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
            + 添加
          </button>
        </div>

        {showAddForm && (
          <div className="add-item-form">
            <input
              type="text"
              className="form-input"
              placeholder="输入想去的地方..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              autoFocus
            />
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowAddForm(false)}>
                取消
              </button>
              <button className="btn btn-primary" onClick={handleAddItem} disabled={!newItemName.trim()}>
                添加
              </button>
            </div>
          </div>
        )}

        <div className="list-items">
          {list.items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><NotebookPen size={48} strokeWidth={1.5} /></div>
              <h3 className="empty-title">还没有清单内容</h3>
              <p className="empty-desc">添加你想去的地方吧</p>
            </div>
          ) : (
            list.items.map((item) => (
              <div key={item.id} className="list-item-card card" onClick={() => handleToggleStatus(item.id, item.status)}>
                <div className="list-item-header">
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
                <h4 className="list-item-name">{item.name}</h4>
                {item.destination && <p className="list-item-destination">📍 {item.destination}</p>}
                {item.note && <p className="list-item-note">{item.note}</p>}
                {item.completedAt && (
                  <p className="list-item-completed">完成于 {new Date(item.completedAt).toLocaleDateString()}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ListDetailPage