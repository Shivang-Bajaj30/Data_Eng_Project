package com.notvault.backend.service;

import java.util.List;

import com.notvault.backend.model.AuditLog;
import com.notvault.backend.model.StreamEvent;
import com.notvault.backend.model.User;
import com.notvault.backend.store.AuditLogRepository;
import com.notvault.backend.store.StreamEventRepository;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

/**
 * Event side-effects shared by all services: audit trail entries and the
 * Kafka event mirror (persisted so the admin Streams view survives restarts).
 * In production these writes happen alongside the real Kafka publish.
 */
@Service
public class EventService {

    private final AuditLogRepository auditRepo;
    private final StreamEventRepository eventsRepo;

    public EventService(AuditLogRepository auditRepo, StreamEventRepository eventsRepo) {
        this.auditRepo = auditRepo;
        this.eventsRepo = eventsRepo;
    }

    public void audit(User actor, String action, String target) {
        AuditLog entry = new AuditLog();
        entry.id = Ids.next("audit");
        entry.userId = actor == null ? "system" : actor.id;
        entry.userName = actor == null ? "system" : actor.name;
        entry.action = action;
        entry.target = target;
        entry.createdAt = java.time.Instant.now();
        auditRepo.save(entry);
        emit("audit-stream", action, target);
    }

    public void emit(String topic, String type, String payload) {
        StreamEvent event = new StreamEvent();
        event.id = Ids.next("evt");
        event.topic = topic;
        event.type = type;
        event.payload = payload;
        event.createdAt = java.time.Instant.now();
        eventsRepo.save(event);
    }

    public List<AuditLog> recentAudit(int limit) {
        return auditRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().limit(limit).toList();
    }

    public List<StreamEvent> recentEvents(int limit) {
        return eventsRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().limit(limit).toList();
    }

    public long totalEvents() {
        return eventsRepo.count();
    }

    public String lastEventTime() {
        StreamEvent newest = eventsRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().findFirst().orElse(null);
        return newest == null ? "no events yet" : newest.createdAt.toString();
    }
}
