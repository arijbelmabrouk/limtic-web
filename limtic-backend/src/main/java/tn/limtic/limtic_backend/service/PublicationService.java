package tn.limtic.limtic_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tn.limtic.limtic_backend.model.Publication;
import tn.limtic.limtic_backend.repository.PublicationRepository;
import java.util.List;

@Service
public class PublicationService {

    private final PublicationRepository publicationRepository;

    public PublicationService(PublicationRepository publicationRepository) {
        this.publicationRepository = publicationRepository;
    }

    public List<Publication> getAll() {
        return publicationRepository.findAll();
    }

    public Publication getById(Long id) {
        return publicationRepository.findById(id).orElse(null);
    }

    public List<Publication> getByAnnee(int annee) {
        return publicationRepository.findByAnnee(annee);
    }

    public List<Publication> getByType(String type) {
        return publicationRepository.findByType(type);
    }

    public Publication save(Publication publication) {
        return publicationRepository.save(publication);
    }

    public void delete(Long id) {
        publicationRepository.deleteById(id);
    }

    public Publication updateStatut(Long id, String statut) {
        Publication pub = getById(id);
        pub.setStatut(statut);
        return publicationRepository.save(pub);
    }

    public Page<Publication> getPaged(Pageable pageable) {
        return publicationRepository.findAll(pageable);
    }
}