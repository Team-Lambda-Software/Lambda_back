import { OrmBlog } from 'src/blog/infraestructure/entities/orm-entities/orm-blog';
import { OrmCourse } from 'src/course/infraestructure/entities/orm-entities/orm-course';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'category' })
export class OrmCategory {
  @PrimaryColumn({ type: 'uuid' }) id: string;
  @Column('varchar') categoryName: string;
  @Column('varchar') description: string;

  @Column({ type: 'varchar', nullable: true }) icon: string;

  @OneToMany(() => OrmCourse, (course) => course.category)
  courses: OrmCourse[];

  @OneToMany(() => OrmBlog, (blog) => blog.category)
  blogs: OrmBlog[];

  static create(
    id: string,
    categoryName: string,
    description: string,
    icon: string,
  ) {
    const categorie = new OrmCategory();
    categorie.id = id;
    categorie.categoryName = categoryName;
    categorie.description = description;
    categorie.icon = icon;
    return categorie;
  }
}
