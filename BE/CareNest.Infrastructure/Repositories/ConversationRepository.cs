using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Repositories;

public class ConversationRepository : IConversationRepository
{
    private readonly CareNestDbContext _context;

    public ConversationRepository(CareNestDbContext context)
    {
        _context = context;
    }

    public async Task<Conversation?> GetByIdAsync(Guid id)
    {
        return await _context.Conversations
            .Include(c => c.User)
            .Include(c => c.HealthcareProvider)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Conversation?> GetByIdWithMessagesAsync(Guid id, int pageSize = 50, int page = 1)
    {
        var conversation = await _context.Conversations
            .Include(c => c.User)
            .Include(c => c.HealthcareProvider)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (conversation != null)
        {
            var messages = await _context.Messages
                .Include(m => m.Sender)
                .Where(m => m.ConversationId == id)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            conversation.Messages = messages.OrderBy(m => m.CreatedAt).ToList();
        }

        return conversation;
    }

    public async Task<IEnumerable<Conversation>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Conversations
            .Include(c => c.User)
            .Include(c => c.HealthcareProvider)
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
                .ThenInclude(m => m.Sender)
            .Where(c => c.UserId == userId || c.HealthcareProviderId == userId)
            .OrderByDescending(c => c.LastActivityAt ?? c.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Conversation>> GetByHealthcareProviderIdAsync(Guid providerId)
    {
        return await _context.Conversations
            .Include(c => c.User)
            .Include(c => c.HealthcareProvider)
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
                .ThenInclude(m => m.Sender)
            .Where(c => c.HealthcareProviderId == providerId)
            .OrderByDescending(c => c.LastActivityAt ?? c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Conversation?> GetDirectConversationAsync(Guid userId1, Guid userId2)
    {
        // For simplified chat, this is equivalent to GetByUserAndProviderAsync
        return await GetByUserAndProviderAsync(userId1, userId2);
    }

    public async Task<Conversation?> GetConsultationConversationAsync(Guid patientId, Guid providerId)
    {
        // For simplified chat, this is equivalent to GetByUserAndProviderAsync
        return await GetByUserAndProviderAsync(patientId, providerId);
    }

    public async Task<Conversation> CreateAsync(Conversation conversation)
    {
        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync();
        return conversation;
    }

    public async Task<Conversation> UpdateAsync(Conversation conversation)
    {
        conversation.UpdatedAt = DateTime.UtcNow;
        _context.Conversations.Update(conversation);
        await _context.SaveChangesAsync();
        return conversation;
    }

    public async Task DeleteAsync(Guid id)
    {
        var conversation = await _context.Conversations.FindAsync(id);
        if (conversation != null)
        {
            _context.Conversations.Remove(conversation);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Conversations.AnyAsync(c => c.Id == id);
    }

    public async Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId)
    {
        return await _context.Conversations
            .AnyAsync(c => c.Id == conversationId && (c.UserId == userId || c.HealthcareProviderId == userId));
    }

    public async Task<int> GetUnreadCountForUserAsync(Guid userId)
    {
        // Simplified: count unread messages in user's conversations
        var userConversations = await _context.Conversations
            .Where(c => c.UserId == userId || c.HealthcareProviderId == userId)
            .Select(c => c.Id)
            .ToListAsync();

        return await _context.Messages
            .Where(m => userConversations.Contains(m.ConversationId) &&
                       m.SenderId != userId &&
                       !m.IsRead)
            .CountAsync();
    }

    public async Task<int> GetActiveConsultationsCountAsync(Guid providerId)
    {
        return await _context.Conversations
            .Where(c => c.HealthcareProviderId == providerId && c.IsActive)
            .CountAsync();
    }

    public async Task<IEnumerable<Conversation>> GetRecentConversationsAsync(Guid userId, int count = 10)
    {
        return await _context.Conversations
            .Include(c => c.User)
            .Include(c => c.HealthcareProvider)
            .Where(c => c.UserId == userId || c.HealthcareProviderId == userId)
            .OrderByDescending(c => c.LastActivityAt ?? c.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    // New simplified methods
    public async Task<Conversation?> GetByUserAndProviderAsync(Guid userId, Guid healthcareProviderId)
    {
        return await _context.Conversations
            .Include(c => c.User)
            .Include(c => c.HealthcareProvider)
            .FirstOrDefaultAsync(c => c.UserId == userId && c.HealthcareProviderId == healthcareProviderId);
    }

    public async Task<List<Conversation>> GetUserConversationsAsync(Guid userId)
    {
        return await _context.Conversations
            .Include(c => c.User)
            .Include(c => c.HealthcareProvider)
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
                .ThenInclude(m => m.Sender)
            .Where(c => c.UserId == userId || c.HealthcareProviderId == userId)
            .OrderByDescending(c => c.LastActivityAt ?? c.CreatedAt)
            .ToListAsync();
    }
}
