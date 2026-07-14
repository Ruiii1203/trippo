import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ListTodo } from 'lucide-react'
import { useListStore } from '../../stores/useListStore'
import { listTypeConfig } from '../../data/mockLists'

function ListListPage() {
  const { lists, loaded, loadLists } = useListStore()

  useEffect(() => {
    if (!loaded) {
      loadLists()
    }
  }, [loaded, loadLists])

  const getProgress = (listId: string) => {
    const list = lists.find((l) => l.id === listId)
    if (!list) return { total: 0, completed: 0, percentage: 0 }
    const total = list.items.length
    const completed = list.items.filter((item) => item.status === 'completed').length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percentage }
  }

  return (
    <div className="page list-list-page">
      <header className="page-header">
        <h1 className="page-title">我的清单</h1>
      </header>

      <div className="page-content">
        {lists.length === 0 && loaded ? (
          <div className="empty-state">
            <div className="empty-icon"><ListTodo size={48} strokeWidth={1.5} /></div>
            <h3 className="empty-title">还没有清单</h3>
            <p className="empty-desc">创建你的第一个主题清单吧</p>
          </div>
        ) : (
          <div className="list-list">
            {lists.map((list) => {
              const config = listTypeConfig[list.type]
              const progress = getProgress(list.id)
              return (
                <Link key={list.id} to={`/lists/${list.id}`} className="list-card card">
                  <div className="list-card-header">
                    <span className="list-icon">{list.icon || config.icon}</span>
                    <div className="list-info">
                      <h3 className="list-name">{list.name}</h3>
                      <p className="list-desc">{list.description}</p>
                    </div>
                  </div>
                  <div className="list-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress.percentage}%`, backgroundColor: config.color }}
                      />
                    </div>
                    <span className="progress-text">{progress.completed}/{progress.total}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ListListPage