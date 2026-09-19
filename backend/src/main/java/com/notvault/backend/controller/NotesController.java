package com.notvault.backend.controller;

import java.util.Map;

import com.notvault.backend.model.Note;
import com.notvault.backend.model.User;
import com.notvault.backend.security.AuthContext;
import com.notvault.backend.service.NoteService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** HTTP layer only: RBAC + request/response mapping. Logic lives in NoteService. */
@RestController
@RequestMapping("/api")
public class NotesController {

    private final NoteService notes;
    private final AuthContext auth;

    public NotesController(NoteService notes, AuthContext auth) {
        this.notes = notes;
        this.auth = auth;
    }

    public record UploadRequest(String title, String description, String subject, String classId,
            String[] tags, String fileName) {
    }

    public record ReviewRequest(String decision) {
    }

    @GetMapping("/notes")
    public Map<String, Object> listNotes(@RequestParam(required = false) String q,
            @RequestParam(required = false) String classId,
            @RequestParam(required = false) String subject) {
        return Map.of("notes", notes.catalog(q, classId, subject));
    }

    /** Semantic-search stub today; swaps to $vectorSearch when embeddings are wired. */
    @GetMapping("/notes/search")
    public Map<String, Object> semanticSearch(@RequestParam(required = false) String q) {
        return Map.of("notes", notes.catalog(q, null, null));
    }

    @GetMapping("/notes/mine")
    public Map<String, Object> myNotes(HttpServletRequest request) {
        User user = auth.requireRole(request, "moderator", "admin");
        return Map.of("notes", notes.uploadedBy(user));
    }

    @GetMapping("/admin/notes")
    public Map<String, Object> allNotes(HttpServletRequest request) {
        auth.requireRole(request, "admin");
        return Map.of("notes", notes.pendingQueue());
    }

    @PostMapping("/notes")
    public ResponseEntity<Map<String, Object>> upload(HttpServletRequest request,
            @RequestBody UploadRequest req) {
        User user = auth.requireRole(request, "moderator");
        NoteService.UploadResult result = notes.upload(user, req.title(), req.description(),
                req.subject(), req.classId(), req.tags(), req.fileName());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "note", result.note(),
                "autoPublished", result.autoPublished()));
    }

    @PostMapping("/notes/{id}/delete")
    public Map<String, Object> deleteNote(HttpServletRequest request, @PathVariable String id) {
        User user = auth.require(request);
        notes.delete(user, id);
        return Map.of("ok", true);
    }

    @PostMapping("/admin/notes/{id}/review")
    public Map<String, Object> review(HttpServletRequest request, @PathVariable String id,
            @RequestBody ReviewRequest req) {
        User admin = auth.requireRole(request, "admin");
        Note note = notes.review(admin, id, "approve".equalsIgnoreCase(req.decision()));
        return Map.of("note", note);
    }
}
