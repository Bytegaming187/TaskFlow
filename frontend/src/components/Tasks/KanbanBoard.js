import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function KanbanBoard() {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'Zu erledigen',
      tasks: [
        { id: '1', title: 'Homepage Design', description: 'Wireframes erstellen', priority: 'Hoch' },
        { id: '2', title: 'API Entwicklung', description: 'REST Endpoints', priority: 'Mittel' }
      ]
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Bearbeitung',
      tasks: [
        { id: '3', title: 'Datenbank Setup', description: 'MariaDB einrichten', priority: 'Hoch' }
      ]
    },
    review: {
      id: 'review',
      title: 'Review',
      tasks: [
        { id: '4', title: 'User Testing', description: 'Feedback sammeln', priority: 'Mittel' }
      ]
    },
    done: {
      id: 'done',
      title: 'Erledigt',
      tasks: [
        { id: '5', title: 'Projektplanung', description: 'Initial Setup', priority: 'Hoch' }
      ]
    }
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId
      ? sourceTasks
      : [...destColumn.tasks];
    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks
      }
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'hoch':
        return 'border-l-4 border-red-500';
      case 'mittel':
        return 'border-l-4 border-yellow-500';
      case 'niedrig':
        return 'border-l-4 border-green-500';
      default:
        return 'border-l-4 border-gray-500';
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Kanban Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded shadow ${getPriorityColor(task.priority)}`}
                            >
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-gray-600">{task.description}</p>
                              <div className="mt-2">
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100">
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;
