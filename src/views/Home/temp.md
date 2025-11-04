<!-- <el-scrollbar class="chat-list-container">
        <div class="chat-list">
          <div
            v-for="[key, value] in chatListStore.unreadMessagesMap"
            :key="key"
            :class="['chat-item', { active: activeChat?.id === key }]"
            @click="selectChat(chat)"
          >
            <div class="avatar-container">
              <el-avatar :src="value.thread_avatar" :size="48" />
            </div>

            <div class="chat-info">
              <div class="chat-header">
                <span class="chat-name">{{ value.thread_name }}</span>
                <span class="chat-time">{{ value.lastTime }}</span>
              </div>
              <div class="chat-content">
                <span class="last-message">
                  {{ value.type === 'group' ? `${value.senderName}: ${value.content}` : value.content }}
                </span>
                <el-badge
                  v-if="value.unreadCount > 0"
                  :value="value.unreadCount"
                  :max="99"
                  class="message-badge"
                />
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar> -->
