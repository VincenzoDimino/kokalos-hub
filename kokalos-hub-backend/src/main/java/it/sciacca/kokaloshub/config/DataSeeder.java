package it.sciacca.kokaloshub.config;

import it.sciacca.kokaloshub.model.*;
import it.sciacca.kokaloshub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final CulturalEventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final FeedbackRepository feedbackRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminUserRepository.count() == 0) {
            AdminUser admin = AdminUser.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("Sciacca2026!"))
                    .fullName("Direzione Cultura Comune di Sciacca")
                    .role("ADMIN")
                    .build();
            adminUserRepository.save(admin);
        }

        if (eventRepository.count() == 0) {
            CulturalEvent e1 = CulturalEvent.builder()
                    .titleIt("Carnevale di Sciacca - Sfilata dei Carri Allegorici")
                    .titleEn("Sciacca Carnival - Allegorical Floats Parade")
                    .titleFr("Carnaval de Sciacca - Défilé des Chars Allégoriques")
                    .titleDe("Karneval von Sciacca - Umzug der allegorischen Wagen")
                    .descriptionIt("Uno dei carnevali più antichi e spettacolari d'Italia. Imponenti carri in cartapesta realizzati dai maestri artigiani saccensi sfilano nel centro storico tra musica, danza e satira.")
                    .descriptionEn("One of the oldest and most spectacular carnivals in Italy. Impressive papier-mâché floats crafted by Sciacca's master artisans parade through the historic center with music, dance, and satire.")
                    .descriptionFr("L'un des carnavals les plus anciens et spectaculaires d'Italie. D'imposants chars en papier mâché réalisés par les maîtres artisans défilent dans le centre historique.")
                    .descriptionDe("Einer der ältesten und spektakulärsten Karnevals Italiens. Imposante Pappmaché-Wagen ziehen mit Musik und Tanz durch die Altstadt.")
                    .category("CARNEVALE")
                    .location("Centro Storico / Via Allende, Sciacca")
                    .eventDate(LocalDateTime.now().plusDays(12).withHour(16).withMinute(30))
                    .ticketPrice(10.0)
                    .maxCapacity(500)
                    .availableSeats(485)
                    .imageUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80")
                    .featured(true)
                    .build();

            CulturalEvent e2 = CulturalEvent.builder()
                    .titleIt("Museo Diffuso dei 5 Sensi: Tour delle Botteghe della Ceramica")
                    .titleEn("5 Senses Diffused Museum: Ceramic Workshops Tour")
                    .titleFr("Musée Diffus des 5 Sens : Visite des Ateliers de Céramique")
                    .titleDe("Freilichtmuseum der 5 Sinne: Tour durch die Keramikwerkstätten")
                    .descriptionIt("Un percorso esperienziale nel cuore di Sciacca tra maioliche antiche, forni storici e maestri ceramisti che tramandano un'arte millenaria.")
                    .descriptionEn("An experiential journey in the heart of Sciacca among ancient majolica, historic kilns, and master ceramicists passing down a thousand-year-old art.")
                    .descriptionFr("Un parcours expérientiel au cœur de Sciacca entre majoliques anciennes, fours historiques et maîtres céramistes.")
                    .descriptionDe("Eine Erlebnisreise im Herzen von Sciacca zwischen antiker Majolika, historischen Öfen und Keramikmeistern.")
                    .category("CERAMICA")
                    .location("Quartiere San Michele & Corso Vittorio Emanuele, Sciacca")
                    .eventDate(LocalDateTime.now().plusDays(5).withHour(10).withMinute(0))
                    .ticketPrice(15.0)
                    .maxCapacity(30)
                    .availableSeats(22)
                    .imageUrl("https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80")
                    .featured(true)
                    .build();

            CulturalEvent e3 = CulturalEvent.builder()
                    .titleIt("Il Castello Incantato di Filippo Bentivegna - Visita Guidata al Tramonto")
                    .titleEn("Filippo Bentivegna's Enchanted Castle - Sunset Guided Tour")
                    .titleFr("Le Château Enchanté de Filippo Bentivegna - Visite au Coucher du Soleil")
                    .titleDe("Das Verwunschene Schloss von Filippo Bentivegna - Führung bei Sonnenuntergang")
                    .descriptionIt("Esplora il celebre museo a cielo aperto dell'Art Brut siciliana: migliaia di teste scolpite nella pietra lavica e nei tronchi d'ulivo immersi nella natura.")
                    .descriptionEn("Explore the famous open-air museum of Sicilian Art Brut: thousands of heads sculpted in lava stone and olive tree trunks immersed in nature.")
                    .descriptionFr("Explorez le célèbre musée à ciel ouvert de l'Art Brut sicilien : des milliers de têtes sculptées dans la pierre volcanique et les oliviers.")
                    .descriptionDe("Entdecken Sie das berühmte Freilichtmuseum der sizilianischen Art Brut: Tausende aus Lavastein und Olivenstämmen gemeißelte Köpfe.")
                    .category("MUSEO")
                    .location("Via Filippo Bentivegna, Sciacca")
                    .eventDate(LocalDateTime.now().plusDays(3).withHour(18).withMinute(0))
                    .ticketPrice(8.0)
                    .maxCapacity(45)
                    .availableSeats(38)
                    .imageUrl("https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80")
                    .featured(true)
                    .build();

            CulturalEvent e4 = CulturalEvent.builder()
                    .titleIt("Grotte Vaporose di San Calogero e Monte Kronio - Trekking Culturale")
                    .titleEn("San Calogero Vapor Caves & Mount Kronio - Cultural Trekking")
                    .titleFr("Grottes Vapeureuses de San Calogero et Mont Kronio - Randonnée Culturelle")
                    .titleDe("Dampfgrotten von San Calogero und Monte Kronio - Kulturwanderung")
                    .descriptionIt("Alla scoperta del mito del re sicano Kokalos e dell'ingegno di Dedalo tra le antichissime stufe vaporose termali e il Santuario sul Monte Kronio.")
                    .descriptionEn("Discovering the myth of Sican king Kokalos and Daedalus's ingenuity among the ancient thermal vapor caves and the Sanctuary on Mount Kronio.")
                    .descriptionFr("À la découverte du mythe du roi sicane Kokalos et du génie de Dédale parmi les très anciennes étuves thermales du Mont Kronio.")
                    .descriptionDe("Auf den Spuren des sikanischen Königs Kokalos und des Dädalus zwischen den uralten Thermal-Dampfgrotten am Monte Kronio.")
                    .category("TERME")
                    .location("Riserva Naturale Monte Kronio, Sciacca")
                    .eventDate(LocalDateTime.now().plusDays(8).withHour(9).withMinute(30))
                    .ticketPrice(12.0)
                    .maxCapacity(25)
                    .availableSeats(19)
                    .imageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80")
                    .featured(false)
                    .build();

            CulturalEvent e5 = CulturalEvent.builder()
                    .titleIt("Notte al Teatro Popolare Samonà: Musica e Mito Mediterraneo")
                    .titleEn("Night at Samonà Popular Theater: Mediterranean Music & Myth")
                    .titleFr("Nuit au Théâtre Populaire Samonà : Musique et Mythe Méditerranéen")
                    .titleDe("Nacht im Volkstheater Samonà: Mediterrane Musik und Mythos")
                    .descriptionIt("Spettacolo sinfonico e teatrale nella suggestiva architettura contemporanea del Teatro Samonà affacciato sul mare d'Africa.")
                    .descriptionEn("Symphonic and theatrical performance in the evocative contemporary architecture of Teatro Samonà overlooking the African Sea.")
                    .descriptionFr("Spectacle symphonique et théâtral dans l'architecture contemporaine du Théâtre Samonà face à la mer.")
                    .descriptionDe("Sinfonie- und Theateraufführung in der beeindruckenden Architektur des Teatro Samonà mit Blick auf das Meer.")
                    .category("TEATRO")
                    .location("Via Agatocle, Teatro Samonà, Sciacca")
                    .eventDate(LocalDateTime.now().plusDays(15).withHour(21).withMinute(0))
                    .ticketPrice(20.0)
                    .maxCapacity(200)
                    .availableSeats(175)
                    .imageUrl("https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80")
                    .featured(false)
                    .build();

            CulturalEvent e6 = CulturalEvent.builder()
                    .titleIt("Azzurro Food & Gusto Sicano: Degustazione al Porto Pescareccio")
                    .titleEn("Azzurro Food & Sican Taste: Fishing Harbor Tasting")
                    .titleFr("Azzurro Food & Goût Sicane : Dégustation au Port de Pêche")
                    .titleDe("Azzurro Food & Sikanischer Geschmack: Verkostung am Fischerhafen")
                    .descriptionIt("Degustazione guidata del gambero rosa di Sciacca, olio extravergine IGP e dolci della tradizione conventuale.")
                    .descriptionEn("Guided tasting of Sciacca pink shrimp, PGI extra virgin olive oil, and traditional convent pastries.")
                    .descriptionFr("Dégustation guidée de la crevette rose de Sciacca, d'huile d'olive IGP et de pâtisseries conventuelles.")
                    .descriptionDe("Geführte Verkostung der rosa Garnelen von Sciacca, g.g.A.-Olivenöl und traditionellem Klostergebäck.")
                    .category("GASTRONOMIA")
                    .location("Molo Levante - Porto di Sciacca")
                    .eventDate(LocalDateTime.now().plusDays(10).withHour(19).withMinute(30))
                    .ticketPrice(25.0)
                    .maxCapacity(60)
                    .availableSeats(44)
                    .imageUrl("https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80")
                    .featured(true)
                    .build();

            eventRepository.saveAll(List.of(e1, e2, e3, e4, e5, e6));

            Booking b1 = Booking.builder()
                    .bookingCode("KKL-2026-8491")
                    .event(e2)
                    .visitorName("Elena Rostova")
                    .visitorEmail("elena.rostova@example.com")
                    .visitorPhone("+39 333 1234567")
                    .numberOfTickets(4)
                    .preferredLanguage("EN")
                    .status("CONFIRMED")
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .build();

            Booking b2 = Booking.builder()
                    .bookingCode("KKL-2026-3910")
                    .event(e1)
                    .visitorName("Marco Bellini")
                    .visitorEmail("marco.bellini@example.it")
                    .visitorPhone("+39 347 9876543")
                    .numberOfTickets(5)
                    .preferredLanguage("IT")
                    .status("CONFIRMED")
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build();

            Booking b3 = Booking.builder()
                    .bookingCode("KKL-2026-5521")
                    .event(e3)
                    .visitorName("Lukas Weber")
                    .visitorEmail("lukas.weber@example.de")
                    .visitorPhone("+49 170 4455667")
                    .numberOfTickets(2)
                    .preferredLanguage("DE")
                    .status("PENDING")
                    .createdAt(LocalDateTime.now().minusHours(5))
                    .build();

            bookingRepository.saveAll(List.of(b1, b2, b3));

            Feedback f1 = Feedback.builder()
                    .event(e2)
                    .authorName("Claire Dubois")
                    .nationality("France")
                    .rating(5)
                    .comment("Une expérience authentique au cœur de Sciacca ! Les maîtres céramistes sont passionnés et l'accueil via Kokalos Hub est impeccable.")
                    .approved(true)
                    .createdAt(LocalDateTime.now().minusDays(3))
                    .build();

            Feedback f2 = Feedback.builder()
                    .event(e3)
                    .authorName("Giulia Ferretti")
                    .nationality("Italia")
                    .rating(5)
                    .comment("Il Castello Incantato al tramonto è pura magia. Prenotazione rapidissima e guida preparatissima.")
                    .approved(true)
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build();

            feedbackRepository.saveAll(List.of(f1, f2));
        }
    }
}
